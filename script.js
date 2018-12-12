$(function () {
	function ktten() {
		if($("#ten").val() == ""){
			$("#tbten").html("Bat buoc nhap");
			return false;
		}
		else if($("#ten").val() != "admin"){
			$("#tbten").html("Sai ten dang nhap");
			return false;
		}
		else{
			$("#tbten").html();
			return true;
		}
	}
	function ktmk() {
		if($("#pass").val() == ""){
			$("#tbpass").html("Bat buoc nhap");
			return false;
		}
		else if($("#pass").val() != "123") {
			$("#tbpass").html("Sai mat khau");
			return false;
		}
		else {
			$("#tbpass").html("");
			return true;
		}
	}

	$("#btndn").on("click",ktten);
	$("#btndn").on("click",ktmk);
})