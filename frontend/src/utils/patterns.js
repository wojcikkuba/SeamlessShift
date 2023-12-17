const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^\d{9}$/;
const firstNamePattern = /^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ -]+$/;
const lastNamePattern = /^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ -]+$/;
const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

export { emailPattern, phonePattern, firstNamePattern, lastNamePattern, passwordRegex };