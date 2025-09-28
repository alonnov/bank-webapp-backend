import { isValidDateFormat } from '../../utils/dateUtils';

export const isValidDate = (dateStr: string): boolean => {
    return isValidDateFormat(dateStr);
}


export const isOver18 = (dateStr: string): boolean => {
    const [day, month, year] = dateStr.split('.').map(Number);
    const birthdate = new Date(year, month - 1, day);
    
    if(isNaN(birthdate.getTime())) {
        return false;
    }
    
    const today = new Date();
    const cutoff = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    
    return birthdate <= cutoff;
}

