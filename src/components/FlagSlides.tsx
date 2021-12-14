import { Flag } from "../redux/reducers/QuizReducer";
import { IonSlides } from "@ionic/react";
import FlagSlide from "../components/FlagSlide";
import React, { useEffect, useRef } from "react";
import { isEqual } from "lodash";

// Create custom comparison function
function deepCompareProps(prevProps: any, nextProps: any) {
  const isSameValues =
    prevProps?.flags?.length === nextProps?.flags?.length &&
    isEqual(prevProps.selectedFlag, nextProps.selectedFlag);
  console.log("isSameValues", isSameValues);

  return isSameValues;
}

const FlagSlides: React.FC<{
  flags: Flag[];
  selectedFlag: Flag;
  selectFlag: any;
  slidesRef: React.RefObject<HTMLIonSlidesElement>;
}> = (props) => {
  // const slidesRef = useRef<HTMLIonSlidesElement>(null);
  ///flag Slides Options
  const slideOpts = {
    initialSlide: 5,
    speed: 500,
    direction: "horizontal",
    height: 100,
    slidesPerView: 3,
  };

  useEffect(() => {
    console.log("useEffect selectedFlag2", props.selectedFlag.WdCode);
    // display flags slider with current selected flag in middle
    if (
      props.slidesRef.current?.slideTo &&
      props.selectedFlag.WdCode !== undefined
    ) {
      //find index of selected flag
      console.log("In Condition FLAGS", props.flags);
      let index = props.flags.findIndex(
        (f) => f.WdCode === props.selectedFlag.WdCode
      );
      //there are 3 flags in screen, set the selected one in the middle, so poisition index-1
      index = index === 0 ? index : index - 1;
      props.slidesRef.current?.slideTo(index, 500);
    }
    // trigger when flag change or slideref is setup
  }, [props.selectedFlag.WdCode, props.slidesRef.current]);

  const selectFlagchangedHandler = (flag: Flag) => {
    props.selectFlag(flag);
  };

  const flagSlides = props.flags.map((flag) => {
    return (
      <FlagSlide
        flag={flag}
        key={flag.WdCode}
        selectedFlagChanged={selectFlagchangedHandler}
      />
    );
  });

  return (
    <IonSlides
      id="flagsSlide"
      pager={false}
      options={slideOpts}
      ref={props.slidesRef}
    >
      {props.flags && props.flags.length > 0 && flagSlides}
    </IonSlides>
  );
};

export default React.memo(FlagSlides);
