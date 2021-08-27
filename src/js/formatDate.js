export default function formatDate( input_date, date_format ){
	date_format = ( date_format ? date_format.toUpperCase( ) : "MM/DD/YYYY" );

	let readable_date = "",
		m = "" + ( input_date.getMonth( ) + 1 ),
		mm = ( m.length < 2 ? "0" + m : m ),
		d = "" + input_date.getDate( ),
		dd = ( d.length < 2 ? "0" + d : d ),
		yyyy = "" + input_date.getFullYear( ),
		months = { 
			1: { "short": "Jan", "long": "January" },
			2: { "short": "Feb", "long": "February" },
			3: { "short": "Mar", "long": "March" },
			4: { "short": "Apr", "long": "April" },
			5: { "short": "May", "long": "May" },
			6: { "short": "Jun", "long": "June" },
			7: { "short": "Jul", "long": "July" },
			8: { "short": "Aug", "long": "August" },
			9: { "short": "Sep", "long": "September" },
			10: { "short": "Oct", "long": "October" },
			11: { "short": "Nov", "long": "November" },
			12: { "short": "Dec", "long": "December" }
		};	

	switch( date_format ){
		case "MM/DD/YYYY": case "MM/DD/YY": case "M/D/YYYY": case "M/D/YY":
		case "MM-DD-YYYY": case "MM-DD-YY": case "M-D-YYYY": case "M-D-YY":
			let splitter = "/";
			
			if( date_format.indexOf ( "-" ) > -1 ){
				splitter = "-";
			}
								
			let date_format_arr = date_format.split( splitter );
						
			readable_date = [ 
				( date_format_arr[ 0 ] == "MM" ? mm : m ) , 
				( date_format_arr[ 1 ] == "DD" ? dd : d ) , 
				( date_format_arr[ 2 ] == "YYYY" ? yyyy : yyyy.substring(2, 4) ) 
			].join( splitter );
			break;
					
		case "YYYY-MM-DD":
			readableDate = [ yyyy, mm, dd ].join ( "-" );
			break;
					
		case "MONTH DD, YYYY": case "MON DD, YYYY":
			let month = months[ m ].short;
		
			if( date_format.indexOf ( "MONTH" ) > -1 ){
				month = months[ m ].long;
			}
		
			readable_date = month + " " + dd + ", " + yyyy;
			break;
							
	}
	
	return readable_date; 
		
}