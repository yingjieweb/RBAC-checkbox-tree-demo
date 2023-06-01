import React, { useEffect, useState } from "react";
// components
import CheckboxTree from "./components/CheckboxTree";
// constants
import TEST_DATA from "./db/data.json";
// styles
import "./App.css";

// types
export type AuthItemType = {
  id: number;
  name: string;
  authStatus: number;
  preAccessIds: number[];
  postAccessIds: number[];
};
export type AuthMenuItemType = {
  menuId: number;
  menuName: string;
  menuStatus: number;
  authMenuList?: AuthMenuItemType[];
  authList?: AuthItemType[];
};
export type AuthTreeType = AuthMenuItemType[];

const App: React.FC = () => {
  // states
  const [authTreeList, setAuthTreeList] = useState<AuthTreeType>([]);

  // methods
  const updateMenuStatus = (menuId: number) => {
    console.log({menuId});
  };
  const updateAuthStatus = (
    authId: number,
    preAccessIds: number[],
    postAccessIds: number[],
    nextStatus: number
  ) => {
    console.log({authId});
    console.log({preAccessIds});
    console.log({postAccessIds});
    console.log({nextStatus});
  };

  // watch
  useEffect(() => {
    setAuthTreeList(TEST_DATA);
  }, []);

  // template
  return (
    <>
      {authTreeList.map((item: AuthMenuItemType) => (
        <CheckboxTree
          data={item}
          updateMenuStatus={updateMenuStatus}
          updateAuthStatus={updateAuthStatus}
        />
      ))}
    </>
  );
};

export default App;
