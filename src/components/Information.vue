<template>
  	<v-container>
    	<v-row>
      		<v-col cols="12">
        		<Search />
      		</v-col>
      		<v-col cols="12" v-if="stcode">  
        		<StreetDetail />
      		</v-col>
    	</v-row>
  	</v-container>
</template>

<script>
    import Search from "./Search.vue";
    
    export default {
        name: "information",
        
		components: {
            Search,
            StreetDetail: ( ) => import (/* webpackChunkName: "streetdetail"*/"./StreetDetail.vue")
        
		},  
        
		computed: {
        	stcode( ){
            	return this.$route.params.stcode; 
          	
			}

        }

    }
</script>