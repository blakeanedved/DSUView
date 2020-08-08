import { useState, useEffect } from 'react';

const useCollection = (
  ref: firebase.firestore.CollectionReference | firebase.firestore.Query
) => {
  const [value, setValue] = useState<
    firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>
  >();

  useEffect(() => {
    const unsubscribe = ref.onSnapshot((snapshot) => setValue(snapshot));

    return () => unsubscribe();
  }, [ref]);

  return [value];
};

export default useCollection;
