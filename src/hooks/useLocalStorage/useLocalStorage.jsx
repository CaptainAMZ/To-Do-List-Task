const useLocalStorage = () => {
  const setUserData = (data, key) => {
    const stringifieData = JSON.stringify(data);
    localStorage.setItem(key, stringifieData);
  };

  const getUserData = (key) => {
    const localStorageData = localStorage.getItem(key);
    if (localStorageData) {
      return JSON.parse(localStorageData);
    } else return null;
  };

  return { getUserData, setUserData };
};

export default useLocalStorage;
