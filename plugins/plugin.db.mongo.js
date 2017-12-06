/**
	 * Plugin for mongoose
	 * 
	 * @param {AppEmitter} emitter
	 * 		sharky AppEmitter instance from core.
	 * @param {object} db
	 * 		object list of model see example on how to do it
	 **/
    module.exports = function(emitter,db){
        
        /**
         * Hook create
         * 
         * @param {object} options
         * 		payload object to be pass on to hook
         * @param {string} options.table
         * 		name of the table
         * @param {object} content
         * 		content object to insert in the table
         * @param {function} finish
         * 		callback function to notify the listener with the response from these hook
         **/
        emitter.registerHook('db::create',function(options,finish){
            
            if(db[options.table]){
                db[options.table].create(options.content,finish);
            }
            else{
                finish("TABLE_NOT_FOUND");
            }
            
        });
        
        /**
         * Hook find
         * 
         * @param {object} options
         * 		payload object to be pass on to hook
         * @param {string} options.table
         * 		name of the table
         * @param {object} content
         * 		 object query to find in the table
         * @param {function} finish
         * 		callback function to notify the listener with the response from these hook
         **/
        emitter.registerHook('db::find',function(options,finish){
            
            if(db[options.table]){
                db[options.table]
                .find(options.content)
                .skip(options.skip || 0)
                .limit(options.limit || 100)
                .sort(options.sort || {})
                .exec(finish);
            }
            else{
                finish("TABLE_NOT_FOUND");
            }
            
        });
        
        /**
         * Hook update
         * 
         * @param {object} options
         * 		payload object to be pass on to hook
         * @param {string} options.table
         * 		name of the table
         * @param {object} content
         * 		content object to insert or update in the table
         * @param {function} finish
         * 		callback function to notify the listener with the response from these hook
         **/
        emitter.registerHook('db::update',function(options,finish){
            
            if(db[options.table]){
                db[options.table].update({"_id" : options.content._id},{$set:options.content},{multi: true},finish);
            }
            else{
                finish("TABLE_NOT_FOUND");
            }
            
        });
    
        /**
         * Hook update bulk
         * 
         * @param {object} options
         * 		payload object to be pass on to hook
         * @param {string} options.table
         * 		name of the table
         * @param {object} content
         * 		content array of object to insert or update in the table
         * @param {function} finish
         * 		callback function to notify the listener with the response from these hook
         **/
        emitter.registerHook('db::update::bulk',function(options,finish){
            
            if(db[options.table]){
                var Bulk = db[options.table].collection.initializeUnorderedBulkOp();
                options.content.forEach(function(content){
                    Bulk.find({ "_id": content._id })
                    .upsert()
                    .update({
                        "$set": content
                    });
                })
                Bulk.execute(finish);
            }
            else{
                finish("TABLE_NOT_FOUND");
            }
            
        });
    
        /**
         * Hook remove
         * 
         * @param {object} options
         * 		payload object to be pass on to hook
         * @param {string} options.table
         * 		name of the table
         * @param {object} content
         * 		content object to remove in the table
         * @param {function} finish
         * 		callback function to notify the listener with the response from these hook
         **/
        emitter.registerHook('db::remove',function(options,finish){
            
            if(db[options.table]){
                db[options.table].remove(options.content,finish);
            }
            else{
                finish("TABLE_NOT_FOUND");
            }
        });
    
        /**
         * Hook insertMany
         * 
         * @param {object} options
         * 		payload object to be pass on to hook
         * @param {string} options.table
         * 		name of the table
         * @param {Array} content
         * 		Array of object to insert in the table
         * @param {function} finish
         * 		callback function to notify the listener with the response from these hook
         **/
        emitter.registerHook('db::insertMany',function(options,finish){
            
            if(db[options.table]){
                db[options.table].insertMany(options.content,finish);
            }
            else{
                finish("TABLE_NOT_FOUND");
            }
        });
    
    };