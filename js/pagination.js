function page(db, prev, next, count){

    var first = db.orderBy(descName, orderName).limit(count);

        return first.get().then((documentSnapshots) => {
            // Get the last visible document

            prev =  documentSnapshots.docs[0]; 
            last = documentSnapshots.docs[documentSnapshots.docs.length-1];
            
            next = db.orderBy(descName, orderName)
            .startAfter(last)
            .limit(2);
        });
    
}