import React, { useEffect, useState } from "react";
// components
import { Checkbox } from "antd";
import { UpOutlined } from "@ant-design/icons";
// types
import { AuthItemType, AuthMenuItemType } from "../../App";
// styles
import "./style.scss";

type IPropsType = {
  data: AuthMenuItemType;
  updateMenuStatus: (arg0: number, arg1: number) => void;
  updateAuthStatus: (
    arg0: number,
    arg1: 1 | 2,
    arg2: number[],
    arg3: number[],
    arg4: number
  ) => void;
};

const CheckboxTree: React.FC<IPropsType> = (props) => {
  // props
  const { data, updateMenuStatus, updateAuthStatus } = props;

  // states
  const [treeData, setTreeData] = useState<AuthMenuItemType>({
    menuId: 0,
    menuName: "Project",
    menuStatus: 2,
    moduleId: 1,
    authMenuList: [],
  });
  const [isCollapse, setIsCollapse] = useState(true);

  // watch
  useEffect(() => {
    setTreeData(data!);
  }, [data]);

  // template
  return (
    <div className="checkboxTree">
      <div className="treeMenu">
        <span className="arrow">
          <UpOutlined
            rotate={isCollapse ? 0 : 180}
            onClick={() => {
              setIsCollapse(!isCollapse);
            }}
          />
        </span>
        <Checkbox
          checked={treeData.menuStatus === 1}
          indeterminate={treeData.menuStatus === 2}
          onChange={() => {
            updateMenuStatus(treeData.menuId, treeData.moduleId);
          }}
        >
          <span className="label">{treeData.menuName}</span>
        </Checkbox>
      </div>
      <div className="treeMenuContent">
        {treeData?.authMenuList &&
          isCollapse &&
          treeData.authMenuList.map((it: AuthMenuItemType, index: number) => (
            <CheckboxTree
              key={index}
              data={it}
              updateMenuStatus={updateMenuStatus}
              updateAuthStatus={updateAuthStatus}
            />
          ))}
        {treeData.authList &&
          isCollapse &&
          treeData.authList.map((it: AuthItemType, index: number) => (
            <>
              <div className="treeMenuItem" key={index}>
                <Checkbox
                  key={it.id}
                  checked={it.authStatus === 1}
                  onChange={() => {
                    updateAuthStatus(
                      it.id,
                      it.authStatus === 1 ? 2 : 1,
                      it.preAuthIds,
                      it.postAuthIds,
                      it.moduleId
                    );
                  }}
                >
                  <span style={{ width: "100%", wordBreak: "break-all" }}>
                    {it.name}
                  </span>
                </Checkbox>
              </div>
            </>
          ))}
      </div>
    </div>
  );
};

export default CheckboxTree;
