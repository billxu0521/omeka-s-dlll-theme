$(document)
    .ready(function() {
    	$('#get_chat_analysis').on('click',function(){
    		//alert('送出訊息!');
    		require(['core/ajax'], function(ajax) {
			    var promises = ajax.call([{
	            methodname: 'block_line_post_test',
	            args: {},
	        }]);		 
			   promises[0].done(function(response) {
			       console.log(response);
			   }).fail(function(mes) {
			       console.log(mes);
			   });
			});
    	});

		$('#send_line_post').on('click',function(){
			$.post( "https://test-moodle38-linebot.dlll.nccu.edu.tw/moodle_line_bot/line_pushbot.php",{ groupid: "U9b872a3510262e29d60ca362de4493a0", text: "安安" }, function( data ) {
				console.log(data);
			});
			console.log('送出後');

		});
    		

    });