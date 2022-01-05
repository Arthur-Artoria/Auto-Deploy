// import { useCallback, useState } from 'react';

// export const useInput = <T extends string>(
//   initialValue: T
// ): [T, React.Dispatch<React.SetStateAction<T>>, (event: React.ChangeEvent<HTMLInputElement>) => void] => {
//   const [state, setState] = useState<T>(initialValue);
//   const handleValueChange = useCallback(
//     (event: React.ChangeEvent<HTMLInputElement>) => setState(event.target.value),
//     []
//   );

//   return [state, setState, handleValueChange];
// };
