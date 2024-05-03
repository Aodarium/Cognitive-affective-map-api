export function isUrlValid(userInput: string): boolean {
    let res = userInput.match(
        /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
    );
    if (res == null) return false;
    else return true;
}

export function isNameValid(userInput: string): boolean {
    let res = userInput.match(/^[0-9a-zA-Z]+$/);
    if (res == null) return false;
    else return true;
}

export function isNumberValid(userInput: number): boolean {
    return true;
    //let res = userInput.match(/^[0-9]+$/);
    //if (res == null) return false;
    //else return true;
}
