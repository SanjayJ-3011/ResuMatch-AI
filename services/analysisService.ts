import { db } from '../firebase';
import {
    collection,
    doc,
    getDocs,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    limit,
    serverTimestamp,
    arrayUnion
} from 'firebase/firestore';
import { ResumeAnalysis, JobMatch } from '../types';

const ANALYSES_COLLECTION = 'analyses';
const USERS_COLLECTION = 'users';

export interface SavedAnalysis {
    id: string;
    userId: string;
    atsScore: number;
    detectedRole: string;
    topSkills: string[];
    summary: string;
    matches: JobMatch[];
    fullAnalysis: ResumeAnalysis;
    createdAt: any; // Firestore Timestamp
}

export const AnalysisService = {
    /**
     * Save a new analysis to Firestore
     */
    saveAnalysis: async (
        userId: string,
        resumeAnalysis: ResumeAnalysis,
        matches: JobMatch[]
    ): Promise<string> => {
        try {
            // Create analysis document
            const analysisData = {
                userId,
                atsScore: resumeAnalysis.atsScore,
                detectedRole: resumeAnalysis.detectedRole,
                topSkills: resumeAnalysis.topSkills,
                summary: resumeAnalysis.summary,
                matches,
                fullAnalysis: resumeAnalysis,
                createdAt: serverTimestamp()
            };

            const docRef = await addDoc(collection(db, ANALYSES_COLLECTION), analysisData);

            // Update user's savedAnalyses array and lastAnalysisAt
            const userRef = doc(db, USERS_COLLECTION, userId);
            await updateDoc(userRef, {
                savedAnalyses: arrayUnion(docRef.id),
                lastAnalysisAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });

            return docRef.id;
        } catch (error) {
            console.error('Error saving analysis:', error);
            throw error;
        }
    },

    /**
     * Get all analyses for a user
     */
    getUserAnalyses: async (userId: string, limitCount: number = 10): Promise<SavedAnalysis[]> => {
        try {
            const analysesRef = collection(db, ANALYSES_COLLECTION);
            const q = query(
                analysesRef,
                where('userId', '==', userId),
                orderBy('createdAt', 'desc'),
                limit(limitCount)
            );

            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as SavedAnalysis));
        } catch (error) {
            console.error('Error getting user analyses:', error);
            return [];
        }
    },

    /**
     * Get a single analysis by ID
     */
    getAnalysis: async (analysisId: string): Promise<SavedAnalysis | null> => {
        try {
            const docRef = doc(db, ANALYSES_COLLECTION, analysisId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                return { id: docSnap.id, ...docSnap.data() } as SavedAnalysis;
            }
            return null;
        } catch (error) {
            console.error('Error getting analysis:', error);
            return null;
        }
    },

    /**
     * Delete an analysis
     */
    deleteAnalysis: async (analysisId: string, userId: string): Promise<void> => {
        try {
            // Verify ownership before deleting
            const analysis = await AnalysisService.getAnalysis(analysisId);
            if (!analysis || analysis.userId !== userId) {
                throw new Error('Unauthorized or analysis not found');
            }

            await deleteDoc(doc(db, ANALYSES_COLLECTION, analysisId));
        } catch (error) {
            console.error('Error deleting analysis:', error);
            throw error;
        }
    }
};
