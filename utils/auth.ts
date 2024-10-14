import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

export const signUp = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Create a user document in Firestore with additional fields
    await setDoc(doc(db, 'users', user.uid), {
      email: user.email,
      createdAt: serverTimestamp(),
      isadmin: false,
      firstName: '',
      lastName: '',
      address: '',
      city: '',
      phoneNumber: '',
      paymentMethod: {
        nameOnCard: '',
        cardNumber: '',
        expMonth: '',
        expYear: '',
        cvv: ''
      }
    });

    console.log('User created successfully:', user.email);
    return user;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};
