import { AuthItemType, AuthMenuItemType, AuthTreeListType } from "../App";

export const findCurAuthTree = (
  authTreeList: AuthTreeListType,
  moduleId: number
) => {
  return authTreeList.filter((item) => item.moduleId === moduleId)[0];
};

export const updateMenuAndDescendantStatus = (
  authTree: AuthMenuItemType,
  menuId: number
) => {
  function traverseAndUpdate(treeData: AuthMenuItemType) {
    if (treeData.menuId === menuId) {
      treeData.menuStatus = treeData.menuStatus === 1 ? 3 : 1;
      if (treeData.authMenuList?.length) {
        treeData.authMenuList = updateDescendantStatus(
          treeData.authMenuList,
          treeData.menuStatus === 1
        ) as AuthMenuItemType[];
      } else if (treeData.authList?.length) {
        treeData.authList = updateDescendantStatus(
          treeData.authList,
          treeData.menuStatus === 1
        ) as AuthItemType[];
      }
    } else if (treeData.authMenuList?.length) {
      for (let i = 0; i < treeData.authMenuList.length; i++) {
        treeData.authMenuList[i] = traverseAndUpdate(treeData.authMenuList[i]);
      }
    }
    return treeData;
  }
  function updateDescendantStatus(
    nodeList: AuthMenuItemType[] | AuthItemType[],
    newStatus: boolean
  ) {
    return nodeList.map((item) => {
      if ("menuStatus" in item && item.menuStatus) {
        item.menuStatus = newStatus ? 1 : 3;
      } else if ("authStatus" in item && item.authStatus) {
        item.authStatus = newStatus ? 1 : 2;
      }
      if ("authMenuList" in item && item.authMenuList?.length) {
        item.authMenuList = updateDescendantStatus(
          item.authMenuList,
          newStatus
        ) as AuthMenuItemType[];
      } else if ("authList" in item && item.authList) {
        item.authList = updateDescendantStatus(
          item.authList,
          newStatus
        ) as AuthItemType[];
      }
      return item;
    });
  }
  traverseAndUpdate(authTree);
  return authTree;
};

export const updateAuthTreeStatus = (
  treeData: AuthMenuItemType | AuthItemType
) => {
  if ("authMenuList" in treeData && treeData.authMenuList?.length) {
    for (let i = 0; i < treeData.authMenuList.length; i++) {
      treeData.authMenuList[i] = updateAuthTreeStatus(
        treeData.authMenuList[i]
      ) as AuthMenuItemType;
    }
    let hasTrue = false;
    let hasFalse = false;
    let hasIndeterminate = false;
    for (let i = 0; i < treeData.authMenuList.length; i++) {
      if (treeData.authMenuList[i].menuStatus === 1) {
        hasTrue = true;
      } else if (treeData.authMenuList[i].menuStatus === 2) {
        hasIndeterminate = true;
      } else if (treeData.authMenuList[i].menuStatus === 3) {
        hasFalse = true;
      }
    }
    if (hasIndeterminate || (hasTrue && hasFalse)) {
      treeData.menuStatus = 2;
    } else if (hasTrue) {
      treeData.menuStatus = 1;
    } else if (hasFalse) {
      treeData.menuStatus = 3;
    }
  } else if ("authList" in treeData && treeData.authList?.length) {
    for (let i = 0; i < treeData.authList.length; i++) {
      treeData.authList[i] = updateAuthTreeStatus(
        treeData.authList[i]
      ) as AuthItemType;
    }
    let hasTrue = false;
    let hasFalse = false;
    for (let i = 0; i < treeData.authList.length; i++) {
      if (treeData.authList[i].authStatus === 1) {
        hasTrue = true;
      } else if (treeData.authList[i].authStatus === 2) {
        hasFalse = true;
      }
    }
    if (hasTrue && hasFalse) {
      treeData.menuStatus = 2;
    } else if (hasTrue) {
      treeData.menuStatus = 1;
    } else if (hasFalse) {
      treeData.menuStatus = 3;
    }
  }
  return treeData;
};

export const updateAuthNodeStatus = (
  treeData: AuthMenuItemType | AuthItemType,
  authId: number
) => {
  if ("id" in treeData && "authStatus" in treeData && treeData.id === authId) {
    treeData.authStatus = treeData.authStatus === 1 ? 2 : 1;
  }
  if ("authMenuList" in treeData && treeData.authMenuList?.length) {
    for (let i = 0; i < treeData.authMenuList.length; i++) {
      updateAuthNodeStatus(treeData.authMenuList[i], authId);
    }
  } else if ("authList" in treeData && treeData.authList?.length) {
    for (let i = 0; i < treeData.authList.length; i++) {
      updateAuthNodeStatus(treeData.authList[i], authId);
    }
  }
  return treeData;
};

export const updatePreAuthNodeStatus = (
  treeData: AuthMenuItemType,
  preAuthIds: number[],
  nextStatus: 1 | 2
) => {
  if (nextStatus === 2) {
    return treeData;
  }
  const allPreAuthIds = preAuthIds;
  for (let index = 0; index < allPreAuthIds.length; index++) {
    const findAllPreAuthIds = (tree: AuthMenuItemType | AuthItemType) => {
      if ("id" in tree && tree.id === allPreAuthIds[index]) {
        if (tree.preAuthIds.length) {
          allPreAuthIds.push(...tree.preAuthIds);
        }
      }
      if ("authMenuList" in tree && tree.authMenuList?.length) {
        for (let i = 0; i < tree.authMenuList.length; i++) {
          findAllPreAuthIds(tree.authMenuList[i]);
        }
      } else if ("authList" in tree && tree.authList?.length) {
        for (let i = 0; i < tree.authList.length; i++) {
          findAllPreAuthIds(tree.authList[i]);
        }
      }
    };
    findAllPreAuthIds(treeData);
  }
  const traverse = (treeNodes: AuthMenuItemType | AuthItemType) => {
    if ("id" in treeNodes && allPreAuthIds.includes(treeNodes.id)) {
      treeNodes.authStatus = nextStatus;
    }
    if ("authMenuList" in treeNodes && treeNodes.authMenuList?.length) {
      for (let i = 0; i < treeNodes.authMenuList.length; i++) {
        traverse(treeNodes.authMenuList[i]);
      }
    } else if ("authList" in treeNodes && treeNodes.authList?.length) {
      for (let i = 0; i < treeNodes.authList.length; i++) {
        traverse(treeNodes.authList[i]);
      }
    }
    return treeNodes;
  };
  traverse(treeData);
  return treeData;
};

export const updatePostAuthNodeStatus = (
  treeData: AuthMenuItemType,
  postAuthIds: number[],
  nextStatus: 1 | 2
) => {
  if (nextStatus === 1) {
    return treeData;
  }
  const allSuAuthIds = postAuthIds;
  for (let index = 0; index < allSuAuthIds.length; index++) {
    const findAllPreAuthIds = (tree: AuthMenuItemType | AuthItemType) => {
      if ("id" in tree && tree.id === allSuAuthIds[index]) {
        if (tree.postAuthIds.length) {
          allSuAuthIds.push(...tree.postAuthIds);
        }
      }
      if ("authMenuList" in tree && tree.authMenuList?.length) {
        for (let i = 0; i < tree.authMenuList.length; i++) {
          findAllPreAuthIds(tree.authMenuList[i]);
        }
      } else if ("authList" in tree && tree.authList?.length) {
        for (let i = 0; i < tree.authList.length; i++) {
          findAllPreAuthIds(tree.authList[i]);
        }
      }
    };
    findAllPreAuthIds(treeData);
  }
  const traverse = (treeNodes: AuthMenuItemType | AuthItemType) => {
    if ("id" in treeNodes && allSuAuthIds.includes(treeNodes.id)) {
      treeNodes.authStatus = nextStatus;
    }
    if ("authMenuList" in treeNodes && treeNodes.authMenuList?.length) {
      for (let i = 0; i < treeNodes.authMenuList.length; i++) {
        traverse(treeNodes.authMenuList[i]);
      }
    } else if ("authList" in treeNodes && treeNodes.authList?.length) {
      for (let i = 0; i < treeNodes.authList.length; i++) {
        traverse(treeNodes.authList[i]);
      }
    }
    return treeNodes;
  };
  traverse(treeData);
  return treeData;
};
