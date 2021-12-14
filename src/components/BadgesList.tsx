import { IonCol } from "@ionic/react";
import React, { useCallback, useEffect } from "react";
import { Theme } from "../redux/constants";
import { Flag } from "../redux/reducers/QuizReducer";
import { Badge } from "../redux/reducers/UquizReducer";
import BadgeElement from "./BadgeElement";

const BadgesList: React.FC<{
  badges: Badge[];
  filter: string;
  flags: Flag[];
}> = (props) => {
  const emptyFct = useCallback(() => {
    console.log("emptyFct");
  }, []);

  const badgesList = (badges: Badge[], filter: string) => {
    const categories = Object.values(Theme);
    return props.flags
      .filter((flag) => {
        if (filter === "USER") {
          return (
            props.badges.findIndex((b) => b.countryWD === flag.WdCode) != -1
          );
        }
        return true;
      })
      .map((flag) => {
        return (
          <IonCol>
            {categories
              .filter((cat) => {
                if (filter === "USER") {
                  return (
                    badges.findIndex(
                      (b) => b.theme === cat && b.countryWD === flag.WdCode
                    ) != -1
                  );
                }
                return true;
              })
              .map((cat) => {
                return (
                  <BadgeElement
                    key={flag.WdCode + cat + flag.label + props.filter}
                    flag={flag}
                    badges={badges}
                    theme={cat}
                    selectBadge={() => emptyFct()}
                  />
                );
              })}
          </IonCol>
        );
      });
  };

  return (
    <React.Fragment>{badgesList(props.badges, props.filter)}</React.Fragment>
  );
};

export default React.memo(BadgesList);
