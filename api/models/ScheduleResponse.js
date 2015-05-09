/**
* ScheduleResponse.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/


module.exports = {
	schema: true,
  attributes: {
  	user_id{
  		model: 'user'
  	},
  	scheduleContent: {
  		model: 'scheduleContent'
  	},
  	available_blocks: {[
  		start_time: {
  			type: 'date'
  		},
  		end_time: {
  			type: 'date'
  		}

  	]}

  }
};

