function myFunction() {
    alert('Called My Function');
    let x = document.cookie;
    var xhr = new XMLHttpRequest();
    console.log(xhr);
    console.log(x + ' Called My Function');
    document.getElementById("demo").innerHTML="Paragraph changed.";
}
