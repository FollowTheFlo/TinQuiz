import { Theme } from "../redux/constants";
import { Flag } from "../redux/reducers/QuizReducer";
import { Badge } from "../redux/reducers/UquizReducer";
import BadgeElement from "../components/BadgeElement";
import React, { useEffect } from "react";
import { isEqual } from "lodash";

// Create custom comparison function
function deepCompareProps(prevProps: any, nextProps: any) {
  const isSame = isEqual(prevProps, nextProps);
  console.log("isDeepCompareSame", isSame);

  return isSame;
}

const BadgesTile: React.FC<{
  themesList: Theme[];
  selectedFlag: Flag;
  badges: Badge[];
  selectBadge: any;
}> = (props) => {
  return (
    <React.Fragment>
      {props.themesList.map((theme) => {
        return (
          <BadgeElement
            key={props.selectedFlag.WdCode + theme}
            flag={props.selectedFlag}
            badges={props.badges}
            theme={theme}
            selectBadge={props.selectBadge}
          />
        );
      })}
    </React.Fragment>
  );
};
export default React.memo(BadgesTile, deepCompareProps);
