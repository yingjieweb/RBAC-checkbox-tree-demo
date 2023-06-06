import React, { useEffect, useState } from "react";
// components
import CheckboxTree from "./components/CheckboxTree";
// constants
import TEST_DATA from "./db/data.json";
// utils
import {
  findCurAuthTree,
  updateMenuAndDescendantStatus,
  updateAuthTreeStatus,
  updateAuthNodeStatus,
  updatePreAuthNodeStatus,
  updatePostAuthNodeStatus,
} from "./utils";

// types
export type AuthItemType = {
  id: number;
  name: string;
  authStatus: number;
  moduleId: number;
  preAuthIds: number[];
  postAuthIds: number[];
};
export type AuthMenuItemType = {
  menuId: number;
  menuName: string;
  menuStatus: number;
  moduleId: number;
  authMenuList?: AuthMenuItemType[];
  authList?: AuthItemType[];
};
export type AuthTreeListType = AuthMenuItemType[];

const App: React.FC = () => {
  // states
  const [authTreeList, setAuthTreeList] = useState<AuthTreeListType>([]);

  // methods
  const updateMenuStatus = (menuId: number, moduleId: number) => {
    const curAuthTree = findCurAuthTree(authTreeList, moduleId);
    const updatedAuthTree = updateMenuAndDescendantStatus(curAuthTree, menuId);
    const updatedFinalAuthTree = updateAuthTreeStatus(updatedAuthTree);
    setAuthTreeList((oldList) => {
      return oldList.map((item) => {
        if (item.moduleId === moduleId) {
          return updatedFinalAuthTree as AuthMenuItemType;
        }
        return item;
      });
    });
  };
  const updateAuthStatus = (
    authId: number,
    nextStatus: 1 | 2,
    preAuthIds: number[],
    postAuthIds: number[],
    moduleId: number
  ) => {
    const curAuthTree = findCurAuthTree(authTreeList, moduleId);
    let updatedAuthTree = updateAuthNodeStatus(curAuthTree, authId);
    if (preAuthIds.length) {
      updatedAuthTree = updatePreAuthNodeStatus(
        updatedAuthTree as AuthMenuItemType,
        preAuthIds,
        nextStatus
      );
    }
    if (postAuthIds) {
      updatedAuthTree = updatePostAuthNodeStatus(
        updatedAuthTree as AuthMenuItemType,
        postAuthIds,
        nextStatus
      );
    }
    const updatedFinalAuthTree = updateAuthTreeStatus(updatedAuthTree);
    setAuthTreeList((oldList) => {
      return oldList.map((item) => {
        if (item.moduleId === moduleId) {
          return updatedFinalAuthTree as AuthMenuItemType;
        }
        return item;
      });
    });
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
