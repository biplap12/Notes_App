
export const validateEmail = (email) => {
    const regex= /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

export const validatePassword = (password) => {
    // Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);}

export const getInitials = (name) => {
   if(!name) return '';
    const words = name.split(' ');
    let initials = '';

    for(let i=0; i<Math.min(words.length, 2); i++){
        initials += words[i][0];
    }
    return initials.toUpperCase();
    
}