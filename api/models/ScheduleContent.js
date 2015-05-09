/**
* ScheduleContent.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
attributes: {
  	schema: true,
  attributes: {
    available_blocks: {[			//An array of available blocks
    	start_date: {
    		time: {
    			type: 'date'
    			}
    	},
    	end_date: {
    		time:{
    			type: 'date'
    		}
    	}
    ]},
    block_size: {
      type: 'integer'			//An integer value of the minimum number of minutes for a meeting time
    }
     /*responses: {
      collection: 'ScheduleResponse',
      via: 'question'
    }*/
 }
};

