export default function objtouppercase( obj ){
    Object.keys( obj ).map( ( key, index ) => {
        if( typeof obj[ key ] === 'string' ){
            obj[ key ] = obj[ key ].toUpperCase( );
        }
    } );

    return obj;

}