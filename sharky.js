"use strict";

const EventEmitter = require('events');
let shortid = require('shortid');
class AppEmitter extends EventEmitter {}

let emitter = new AppEmitter();

/**
 * invokeHook
 * 
 * @param {string} hn
 * 		hook name
 * @param {object} options
 * 		payload object to be pass on to hook
 * @param {function} cb
 * 		callback function to catch async response from these hook
 * 
 * @return 
 **/
emitter.invokeHook = function(hn,options,cb){
	console.log(hn);
	let unique_id = shortid.generate();
	let ctrRspns = 0;
	let responses = [];
	let errors = [];
	
	options.uid = unique_id;
	
	/**
	 * Ensure that each request will receive a proper response 
	 * by making the reponse event name unique per each request
	 * */
	
	emitter.on(hn + '_response_' + options.uid,function(err,response){
		
		let cntLsnr = emitter.listenerCount(hn + '_request');
		ctrRspns++;
		
		if(response){
			responses.push(response);
		}
		if(err){
			errors.push(err);
		}
		
		/**
		 * Respond only once all the listener respond
		 * */
		if(ctrRspns >=cntLsnr){
			emitter.removeAllListeners([hn + '_response_' + options.uid]);
			cb((errors.length > 1) ? errors : err,(responses.length > 1) ? responses : response);
			
		}
		
	});
	
	emitter.emit(hn + '_request',options);
};

/**
 * registerHook
 * 
 * @param {string} hn
 * 		hook name
 * @param {function} cb
 * 		callback function to catch async response from these hook
 **/
emitter.registerHook = function(hn,cb){
	
	emitter.on(hn + '_request',function(options){
		
		cb(options,function(err,content){
			emitter.emit(hn + '_response_' + options.uid,err,content);
		});
		
	});
};

module.exports = emitter;