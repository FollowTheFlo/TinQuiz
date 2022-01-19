import {
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonInput,
  IonPage,
  IonRow,
  IonToolbar,
} from "@ionic/react";
import { create, list, trash } from "ionicons/icons";
import React, { useEffect, useState } from "react";

interface Car {
  id: string;
  make: string;
  model: string;
  year: string;
  isPrimary: boolean;
}

interface DTO {
  username: string;
  cars: Car[];
}

const Cars: React.FC = () => {
  const MAX_CARS = 3;
  const EMPTY_CAR = {
    id: "",
    make: "",
    model: "",
    isPrimary: false,
    year: "",
  };
  const EMPTY_USER_NAME = "Flo";

  const [userName, setUserName] = useState<string>(EMPTY_USER_NAME);
  const [newCarForm, setNewCarForm] = useState<Car>(EMPTY_CAR);
  const [editCarForm, setEditCarForm] = useState<Car>(EMPTY_CAR);
  const [carsList, setCarsList] = useState<Car[]>([
    {
      id: "1111111",
      make: "Honda",
      model: "Civic",
      isPrimary: true,
      year: "2015",
    },
  ]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    console.log("In useEffect");
  }, [carsList]);

  /////// Car CRUD ///////
  const removeCar = (id: string) => {
    setCarsList((currentList) => {
      // use the currentList given by setState Action fct to make sure we have the newest version
      const index = currentList.findIndex((c) => c.id === id);
      if (index === -1) {
        setError("Car not in the list");
        return currentList; // does not cause re-render as same value
      }
      if (carsList[index].isPrimary && currentList.length > 2) {
        // 3 cars : please set another vehicle as primary before removing it
        setError("Please set another car as Primary first");
        return currentList;
      }
      if (carsList[index].isPrimary && carsList.length === 2) {
        return currentList
          .map((car) => {
            return { ...car, isPrimary: true };
          })
          .filter((car) => car.id !== id);
      }
      // default case where target car is not Primary or only 1 car left
      return currentList.filter((car) => car.id !== id);
    });
  };

  const setAsPrimary = (id: string) => {
    console.log("set as primary", id);
    // clear all isPrimary Flags, and set target as primary
    const updatedList = carsList.map((car) => {
      return { ...car, isPrimary: car.id === id ? true : false };
    });
    setCarsList(updatedList);
  };

  const formOnChange = (
    key: "make" | "model" | "year" | "isPrimary" | "id",
    value: string | null | undefined,
    isEdit?: boolean
  ) => {
    // handling new car and edit car forms
    if (isEdit) {
      const copyCar: Car = { ...editCarForm };
      //@ts-ignore
      copyCar[key] = value;
      console.log("copyCar", copyCar);
      setEditCarForm(copyCar);
      return;
    }
    const copyCar: Car = { ...newCarForm };
    //@ts-ignore
    copyCar[key] = value;
    console.log("copyCar", copyCar);
    setNewCarForm(copyCar);
  };

  const addOrEditCar = (car: Car, isEdit?: boolean) => {
    // car is copy of newCar state var to freeze value
    console.log("Saving Car", car);
    if (isEdit) {
      // edit
      const index = carsList.findIndex((c) => c.id === car.id);
      if (index === -1) {
        setError("Car to edit not found");
        return;
      }
      const listCopy = carsList.slice();
      listCopy[index] = car;
      setCarsList(listCopy);
      setEditCarForm(EMPTY_CAR);
      return;
    }

    // set id and isPrimary as not in form
    car.id = Date.now().toString(); // unique ID, fine for prototype
    car.isPrimary = carsList.length === 0 ? true : false; // first car is automatically primary

    setCarsList((currentList) => {
      return currentList.concat(car);
    });
    // clear form
    setNewCarForm(EMPTY_CAR);
  };

  ////// User //////

  const userOnChange = (userNameField: string | null | undefined) => {
    if (userNameField === null || userNameField === undefined) return;
    setUserName(userNameField);
  };

  ///// ajax requests ///////

  const upload = () => {
    const payload = carsList.slice(); // hard copy, shallow copy is enough as no nested properties in Car obj
    const name = userName;
    setLoading(true);
    console.log("upload");
    fetch("http://localhost:3002/cars/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userName: name, cars: payload }),
    })
      .then((res) => res.json())
      .then(
        (result: DTO) => {
          setLoading(false);
          console.log("result");
          if (!result?.cars) return;
          setCarsList(result.cars);
        },

        (error) => {
          setLoading(false);
          console.log("error");
          setError(error["message"] ?? `Error uploading data for ${name}`);
        }
      );
  };

  const download = (name: string) => {
    console.log("download");
    setLoading(true);
    fetch(`http://localhost:3002/cars/download/${name}`)
      .then((res) => res.json())
      .then(
        (result: DTO) => {
          setLoading(false);
          setCarsList(result.cars);
          console.log("result");
        },

        (error) => {
          setLoading(false);
          console.log("error");
          setError(error["message"] ?? `Error downloading data for ${name}`);
        }
      );
  };

  //////// UI Blocks /////////////

  const displayCarFormBlock = (isEdit: boolean) => {
    return (
      <React.Fragment>
        <div
          style={{
            border: "1px solid black",
            margin: "5px",
            backgroundColor: "white",
          }}
        >
          <IonRow>
            <IonCol>
              <IonInput
                style={{
                  border: "1px solid black",
                }}
                minlength={1}
                type="text"
                value={isEdit ? editCarForm.make : newCarForm.make}
                placeholder="Maker"
                onIonChange={(e) =>
                  formOnChange("make", e.detail.value, isEdit ? true : false)
                }
              ></IonInput>
            </IonCol>
            <IonCol>
              <IonInput
                style={{
                  border: "1px solid black",
                }}
                type="text"
                minlength={1}
                value={isEdit ? editCarForm.model : newCarForm.model}
                placeholder="Model"
                onIonChange={(e) =>
                  formOnChange("model", e.detail.value, isEdit ? true : false)
                }
              ></IonInput>
            </IonCol>
            <IonCol>
              <IonInput
                style={{
                  border: "1px solid black",
                }}
                type="text"
                minlength={1}
                value={isEdit ? editCarForm.year : newCarForm.year}
                placeholder="Year"
                onIonChange={(e) =>
                  formOnChange("year", e.detail.value, isEdit ? true : false)
                }
              ></IonInput>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonButton
                size="small"
                onClick={() =>
                  addOrEditCar(
                    isEdit ? { ...editCarForm } : { ...newCarForm },
                    isEdit
                  )
                }
                disabled={
                  isEdit
                    ? !editCarForm.make ||
                      !editCarForm.model ||
                      !editCarForm.year
                      ? true
                      : false
                    : !newCarForm.make || !newCarForm.model || !newCarForm.year
                    ? true
                    : false
                }
              >
                {isEdit ? "Save" : "Add Car"}
              </IonButton>
            </IonCol>
          </IonRow>
        </div>
      </React.Fragment>
    );
  };

  const displayErrorBlock = () => {
    return (
      <IonRow class="ion-align-items-center">
        <IonCol size="9">{error}</IonCol>
        <IonCol size="3">
          <IonButton size="small" color="danger" onClick={() => setError("")}>
            Clear
          </IonButton>
        </IonCol>
      </IonRow>
    );
  };

  const displayCarsListBlock = () => {
    return (
      <React.Fragment>
        {carsList.map((car, index) => {
          return (
            <div
              style={{
                border: "1px solid grey",
                margin: "5px",
                backgroundColor: "lightgrey",
              }}
            >
              <IonRow class="ion-align-items-center">
                <IonCol size="6">
                  {car.make} - {car.model} {car.year}
                </IonCol>
                <IonCol size="2">
                  <input
                    type="checkbox"
                    id={car.id}
                    checked={car.isPrimary}
                    onChange={() => setAsPrimary(car.id)}
                  />
                </IonCol>
                <IonCol size="2">
                  <IonButton size="small" onClick={() => removeCar(car.id)}>
                    <IonIcon icon={trash} />
                  </IonButton>
                </IonCol>
                <IonCol size="2">
                  <IonButton
                    size="small"
                    onClick={() =>
                      setEditCarForm(
                        editCarForm.id !== car.id ? { ...car } : EMPTY_CAR
                      )
                    }
                  >
                    <IonIcon icon={create} />
                  </IonButton>
                </IonCol>
              </IonRow>
              {editCarForm.id === car.id && displayCarFormBlock(true)}
            </div>
          );
        })}
      </React.Fragment>
    );
  };

  const displayHeaderBlock = () => {
    return (
      <IonRow class="ion-align-items-center">
        <IonCol offset="0" size="6">
          Vehicle(s)
        </IonCol>
        <IonCol offset="0" size="3">
          Primary
        </IonCol>
      </IonRow>
    );
  };

  const displayUserBlock = () => {
    return (
      <div
        style={{
          border: "1px solid green",
          margin: "5px",
        }}
      >
        <IonRow class="ion-align-items-center">
          <IonCol size="3">Username:</IonCol>
          <IonCol size="9">
            <IonInput
              style={{
                border: "1px solid black",
              }}
              minlength={1}
              type="text"
              value={userName}
              placeholder="Username"
              onIonChange={(e) => userOnChange(e.detail.value)}
            ></IonInput>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol size="6">
            <IonButton
              disabled={!userName}
              size="small"
              onClick={() => upload()}
            >
              Upload
            </IonButton>
          </IonCol>
          <IonCol size="6">
            <IonButton
              disabled={!userName}
              size="small"
              onClick={() => download(userName)}
            >
              Download
            </IonButton>
          </IonCol>
        </IonRow>
      </div>
    );
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar id="badgesToolbar">
          <div className="mainTitle">Cars</div>
        </IonToolbar>
      </IonHeader>

      <IonContent id="carsPage">
        <IonGrid>
          {loading && <h2>Loading</h2>}
          {error && displayErrorBlock()}
          {displayUserBlock()}
          {carsList.length > 0 && displayHeaderBlock()}
          {carsList.length > 0 && displayCarsListBlock()}
          {carsList.length < MAX_CARS && displayCarFormBlock(false)}
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Cars;
