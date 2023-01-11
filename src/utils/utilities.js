
export const cmToFeetInches = (height) => {
    try {
        let length = height / (2.54);
        let feet = Math.floor(length / 12);
        // setHeightInFeet(JSON.stringify(feet));
        let inch = length - 12 * feet
        // setHeightInInches(Math.round(inch).toString());
        return feet + "'" + Math.round(inch).toString() + '"';
    } catch (error) {
        console.log("Error => ", error);

    }
}