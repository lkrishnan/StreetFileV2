export default function objdiffs( obj1, obj2 ){
    let diff = { }

    for( const [ key, value ] of Object.entries( obj2 ) ){
      
        if( value != obj1[ key ] ){
            diff[ key ] = value;
        }
                
    }   

    return diff;

}