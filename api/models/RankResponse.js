/**
* RankResponse.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/



module.exports = {
  schema: true,
  attributes: {
    user_id: {
      model :'user'
    },
    rankContent: {
      model:'RankContent'
    },
    choices: {[
      type: 'string'
    ]}
  }
};

