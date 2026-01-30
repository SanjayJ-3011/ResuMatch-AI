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
  serverTimestamp,
  writeBatch
} from 'firebase/firestore';
import { Job } from '../types';
import { INITIAL_JOBS } from '../constants';

const JOBS_COLLECTION = 'jobs';

export const JobService = {
  /**
   * Get all jobs from Firestore
   * @param activeOnly - If true, only return active jobs (for users). Admins see all.
   */
  getAllJobs: async (activeOnly: boolean = false): Promise<Job[]> => {
    try {
      const jobsRef = collection(db, JOBS_COLLECTION);
      let q = query(jobsRef, orderBy('createdAt', 'desc'));

      if (activeOnly) {
        q = query(jobsRef, where('isActive', '==', true), orderBy('createdAt', 'desc'));
      }

      const snapshot = await getDocs(q);

      // If no jobs exist, seed with initial jobs
      if (snapshot.empty && !activeOnly) {
        console.log('No jobs found, seeding initial jobs...');
        await JobService.seedInitialJobs();
        return JobService.getAllJobs(activeOnly);
      }

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Job));
    } catch (error) {
      console.error('Error getting jobs:', error);
      // Fallback to initial jobs if Firestore fails
      return INITIAL_JOBS;
    }
  },

  /**
   * Get a single job by ID
   */
  getJob: async (id: string): Promise<Job | null> => {
    try {
      const docRef = doc(db, JOBS_COLLECTION, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Job;
      }
      return null;
    } catch (error) {
      console.error('Error getting job:', error);
      return null;
    }
  },

  /**
   * Add a new job
   */
  addJob: async (job: Omit<Job, 'id'>): Promise<Job> => {
    try {
      const docRef = await addDoc(collection(db, JOBS_COLLECTION), {
        ...job,
        isActive: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      return { id: docRef.id, ...job };
    } catch (error) {
      console.error('Error adding job:', error);
      throw error;
    }
  },

  /**
   * Update an existing job
   */
  updateJob: async (id: string, updates: Partial<Job>): Promise<void> => {
    try {
      const docRef = doc(db, JOBS_COLLECTION, id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating job:', error);
      throw error;
    }
  },

  /**
   * Delete a job
   */
  deleteJob: async (id: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, JOBS_COLLECTION, id));
    } catch (error) {
      console.error('Error deleting job:', error);
      throw error;
    }
  },

  /**
   * Toggle job visibility
   */
  toggleJobActive: async (id: string, isActive: boolean): Promise<void> => {
    try {
      const docRef = doc(db, JOBS_COLLECTION, id);
      await updateDoc(docRef, {
        isActive,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error toggling job:', error);
      throw error;
    }
  },

  /**
   * Seed initial jobs to Firestore
   */
  seedInitialJobs: async (): Promise<void> => {
    try {
      const batch = writeBatch(db);

      INITIAL_JOBS.forEach((job) => {
        const docRef = doc(collection(db, JOBS_COLLECTION));
        batch.set(docRef, {
          ...job,
          id: docRef.id,
          isActive: true,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      });

      await batch.commit();
      console.log('Initial jobs seeded successfully');
    } catch (error) {
      console.error('Error seeding jobs:', error);
      throw error;
    }
  },

  /**
   * Reset to default demo jobs (deletes all and re-seeds)
   */
  resetJobs: async (): Promise<void> => {
    try {
      // Delete all existing jobs
      const snapshot = await getDocs(collection(db, JOBS_COLLECTION));
      const batch = writeBatch(db);

      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });

      await batch.commit();

      // Re-seed initial jobs
      await JobService.seedInitialJobs();
    } catch (error) {
      console.error('Error resetting jobs:', error);
      throw error;
    }
  }
};