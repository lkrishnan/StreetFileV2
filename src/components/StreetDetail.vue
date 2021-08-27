<template>
  	<v-container>
    	<v-row>
      		<v-col cols="12">
        		<v-card class="my-5 pa-5">
					<v-row>
						<v-col col="11">
							<v-card-title>Legal Street Name</v-card-title>
						</v-col>
						<v-col col="1" class="d-flex justify-end">
							<!--<v-btn class="ma-2" color="primary" @click="takeAction( 'Delete_Legal', 0 )" v-if="( auth !== '' && stinfo.alias.length == 0 )" ><v-icon left>mdi-trash-can</v-icon>Delete</v-btn>-->
							<v-btn class="ma-2" color="primary" @click="takeAction( 'Edit_Legal', 0 )" v-if="( auth !== '' )" ><v-icon left>mdi-file-edit</v-icon>Edit</v-btn>
						</v-col>
					</v-row>
          			<v-row>
						<v-col cols="12">
							<v-data-table 
								:headers="headers" 
								:items="stinfo.legal" 
								:items-per-page="1" 
								hide-default-footer>
							</v-data-table>
						</v-col>
          			</v-row>
          			<v-row>
						<v-col cols="12">
							<v-data-table 
								:headers="headers2" 
								:items="stinfo.legal" 
								:items-per-page="1"
								hide-default-footer>
								<template v-slot:item.lowerblock="{item}">
								{{ item.lowerblock }} 
								</template>
								<template v-slot:item.upperblock="{item}">
								{{ item.upperblock }} 
								</template>
								<template v-slot:item.addrnumbers="{item}">
								{{ addrnumbers[ item.addrnumbers ] }}
								</template>
								<template v-slot:item.roadtype="{item}">
								{{ roadtype[ item.roadtype ] }}
								</template>
								<template v-slot:item.staccess="{item}">
								{{ staccess[ item.staccess ] }}
								</template>
							</v-data-table>
						</v-col>
					</v-row> 
          			<v-row>
						<v-col cols="12">
							<v-data-table 
								:headers="headers3" 
								:items="stinfo.legal" 
								:items-per-page="1"
								hide-default-footer>
								<template v-slot:item.reason="{item}">
								{{ reason[ item.reason ] }}
								</template>
							</v-data-table>
						</v-col>
          			</v-row>
          			<v-row>
						<v-col cols="12">
							<v-data-table 
								:headers="headers4" 
								:items="stinfo.legal" 
								:items-per-page="1"
								hide-default-footer>
								<template v-slot:item.created_date="{item}">
								{{ formatTheDate( item.created_date ) }}
								</template>
								<template v-slot:item.last_edited_date="{item}">
								{{ formatTheDate( item.last_edited_date ) }}
								</template>
							</v-data-table>
						</v-col>
          			</v-row>
        		</v-card>
      		</v-col>
    	</v-row>
    	<v-row>
			<v-col cols="12">
				<EsriMap />  
			</v-col>
    	</v-row>
    	<v-row v-if="( stinfo.alias.length > 0 || ( stinfo.alias.length == 0 && auth !== '' ) )">
			<v-col cols="12">
				<v-card class="my-5 pa-5">
					<v-row>
						<v-col col="11">
						<v-card-title>{{ ( stinfo.alias.length > 0 ? "Alias Street Names" : "" ) }}</v-card-title>
						</v-col>
						<v-col col="1" class="d-flex justify-end">
						<v-btn class="ma-2" color="primary" @click="takeAction( 'Add_Alias', 0 )" v-if="( auth !== '' )" ><v-icon left>mdi-plus-circle</v-icon>Add New Alias</v-btn>
						</v-col>
					</v-row>
					<v-expansion-panels inset>
						<v-expansion-panel v-for="(item, index) in stinfo.alias" :key="index">
							<v-expansion-panel-header>
								<v-row>
									<v-col col="11" class="d-flex align-center">
										{{ item.admkey }}
									</v-col>
									<v-col col="1" class="d-flex justify-end">
										<!--<v-btn class="ma-2" color="primary" @click="takeAction( 'Delete_Alias', index )" v-if="( auth !== '' )" ><v-icon left>mdi-trash-can</v-icon>Delete</v-btn>-->
										<v-btn class="ma-2" color="primary" @click="takeAction( 'Edit_Alias', index )" v-if="( auth !== '' )" ><v-icon left>mdi-file-edit</v-icon>Edit</v-btn>
									</v-col>
								</v-row>
							</v-expansion-panel-header>
							<v-expansion-panel-content>
								<v-row>
									<v-col cols="12">
										<v-data-table 
											:headers="headers" 
											:items="[item]" 
											:items-per-page="1" 
											hide-default-footer>
										</v-data-table>
									</v-col>
								</v-row>
								<v-row>
									<v-col cols="12">
										<v-data-table 
											:headers="headers2" 
											:items="[item]" 
											:items-per-page="1"
											hide-default-footer>
											<template v-slot:item.addrnumbers="{item}">
												{{ addrnumbers[ item.addrnumbers ] }}
											</template>
											<template v-slot:item.roadtype="{item}">
												{{ roadtype[ item.roadtype ] }}
											</template>
											<template v-slot:item.staccess="{item}">
												{{ staccess[ item.staccess ] }}
											</template>
										</v-data-table>
									</v-col>
								</v-row>
								<v-row>
									<v-col cols="12">
										<v-data-table 
											:headers="headers3" 
											:items="[item]" 
											:items-per-page="1"
											hide-default-footer>
											<template v-slot:item.reason="{item}">
												{{ reason[ item.reason ] }}
											</template>
										</v-data-table>
									</v-col>
								</v-row>
								<v-row>
									<v-col cols="12">
										<v-data-table 
											:headers="headers4" 
											:items="[item]" 
											:items-per-page="1"
											hide-default-footer>
											<template v-slot:item.created_date="{item}">
												{{ formatTheDate( item.created_date ) }}
											</template>
											<template v-slot:item.last_edited_date="{item}">
												{{ formatTheDate( item.last_edited_date ) }}
											</template>
										</v-data-table>
									</v-col>
								</v-row>
              				</v-expansion-panel-content>
            			</v-expansion-panel>
         			</v-expansion-panels>
        		</v-card>
      		</v-col>
    	</v-row>
  	</v-container>
</template>

<script>
  	import GetInfoByStcode from "../js/getInfoByStCode"
	import FormatDate from "../js/formatDate"
	
	export default {
    	name: "streetdetail",

    	components: {
      		EsriMap: ( ) => import (/* webpackChunkName: "esrimap"*/"./EsriMap.vue")
			
    	},

    	mounted: function( ){
      		this.setInfo( );

    	},

    	data: ( ) => ( {
			headers: [
				{ text: "Dir", value: "preaddrnum", sortable: false },
				{ text: "Street Name", value: "streetname", sortable: false },
				{ text: "Street Type", value: "streettype", sortable: false },
				{ text: "Street Suffix", value: "addrnumsuf", sortable: false },
				{ text: "Jurisdiction", value: "municipality", sortable: false },
				{ text: "County Code", value: "countystcode", sortable: false },
				{ text: "City Code", value: "citystcode", sortable: false }
			],
			headers2: [
				{ text: "Lower Block", value: "lowerblock", sortable: false },
				{ text: "Upper Block", value: "upperblock", sortable: false },
				{ text: "Parity", value: "addrnumbers", sortable: false },
				{ text: "Type", value: "roadtype", sortable: false },
				{ text: "Access", value: "staccess", sortable: false },
				{ text: "Continuous", value: "stcontinuous", sortable: false },
				{ text: "Parcels Attached", value: "parcelsattached", sortable: false }
			],
			headers3: [
				{ text: "Directions to Street", value: "directions", sortable: false },
				{ text: "Comments", value: "comments", sortable: false },
				{ text: "Reason for Name Change", value: "reason", sortable: false }
			],
			headers4: [
				{ text: "Created By", value: "created_user", sortable: false },
				{ text: "Created On", value: "created_date", sortable: false },
				{ text: "Modified By", value: "last_edited_user", sortable: false },
				{ text: "Modified On", value: "last_edited_date", sortable: false },
				{ text: "Modifying Agency", value: "last_edited_agency", sortable: false }
			],
			addrnumbers: {
				"B": "ODD AND EVEN",
				"E": "EVEN ONLY",
				"O": "ODD ONLY"
			},
			staccess: {
				"PUB": "PUBLIC",
				"PVT": "PRIVATE"
			},
			roadtype: {
				"Road": "ROAD",
				"NamedDriveway": "DRIVEWAY"
			},
			reason: {
				"AL": "ALIAS NAME ONLY",
				"AX": "ANNEXATION",
				"CC": "COUNTY COMMISSION",
				"NC": "NAME CHANGE",
				"PC": "PLANNING COMMISSION",
				"SD": "SUBDIVISION",
				null: "NA"
			}

    	} ),

    	computed: {
      		auth( ){
        		return this.$store.state.token

      		},
			new_stinfo( ){
          		return this.$store.state.new_stinfo

      		},
			stcode( ){
				return this.$route.params.stcode

			},
			stinfo( ){
          		return this.$store.state.stinfo

      		},
      		ws( ){
          		return this.$store.state.ws

      		}
      		
    	},

    	watch: {
      		stcode: function( ){
        		this.setInfo( )
      		}

    	},

    	methods: {
			formatTheDate( input_date ){
        		return FormatDate( new Date( input_date ), "MON DD, YYYY" ) + " " + new Date( input_date ).toLocaleTimeString( );
      		
			},

			async setInfo( ){
        		try{
					const _this = this,
          				stcode = _this.stcode;

					if( stcode.toString( ).match( /^[0-9]{1,10}$/ ) ){ //check if stcode is 1-10 digit number
						const data = await GetInfoByStcode( stcode )

						if( data.legal.length > 0 || data.alias.length > 0 ){
							_this.$store.commit( "stinfo", data )
					
						}else{
							throw "Bad search string was passed in the URL"

						}

					}else{
						throw "Bad search string was passed in the URL"

					}
					
				}
				catch( error ){
					console.log( "Parsing Failed:", error )
					//replace the erroneous route with the Search route
					this.$router.replace( { name: "Search" } )
				
				}
				
      		},

      		takeAction( route_name, idx ){
        		const _this = this;

				switch( route_name ){
					case "Add_Alias":
						_this.$store.commit( "new_stinfo", [ { 
							countystcode: _this.stcode,
							citystcode: _this.stinfo.legal[ idx ].citystcode,
							aliaslegalflag: "A",
							staccess: "PUB", 
							addrnumbers: "B",
							parcelsattached: "N", 
							stcontinuous: "Y",
							roadtype: "Road",
							reason: null
						} ] );
						this.$router.push( { name: route_name, params: { stcode: _this.stcode } } )
						break;

					case "Delete_Legal":
						//delete the specific row
						this.$store.dispatch( "delete", { filter: _this.stinfo.legal[ idx ].objectid } );
						break;

					case "Delete_Alias":
						//delete the specific row
						this.$store.dispatch( "delete", { filter: _this.stinfo.alias[ idx ].objectid } );
						break;

					case "Edit_Legal": 
						var { created_user, created_date, last_edited_user, last_edited_date, last_edited_agency, ...temp } = _this.stinfo.legal[ idx ];
						this.$store.commit( "new_stinfo", [ { ...temp } ] );
						this.$router.push( { name: route_name, params: { oid: _this.stinfo.legal[ idx ].objectid  } } )
						break;

					case "Edit_Alias":
						var { created_user, created_date, last_edited_user, last_edited_date, last_edited_agency, ...temp } = _this.stinfo.alias[ idx ];
						this.$store.commit( "new_stinfo", [ { ...temp } ] );
						this.$router.push( { name: route_name, params: { oid: _this.stinfo.alias[ idx ].objectid  } } )
						break;
				
				}

      		}

    	} 

  	}
</script>