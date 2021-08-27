import moment from "moment"

export default function replacefilter( old_filter, new_filter ){
    for( const [ key, value ] of Object.entries( old_filter ) ){
        if( !new_filter.hasOwnProperty( key ) ){
            new_filter[ key ] = value;
        }
    }   

    return new_filter;
}