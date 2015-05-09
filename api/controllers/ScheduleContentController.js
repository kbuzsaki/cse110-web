/**
 * ScheduleContentController
 *
 * @description :: Server-side logic for managing Schedulecontents
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

	//FOR NOW JUST A TEMPLATE IF WE WANT TO CHANGE IT
	create: function(req, res) {
    var data = req.params.all();
   
    ScheduleContent.create(data, function created (err, sched) {
      if (err) return res.negotiate(err);
      console.log("Schedule Created: ");
      res.status(201);
      res.json(poll);
    });
  }
	
};

