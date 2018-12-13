var http = require('http');
var url = require('url');
var fs = require("fs");
var AWS = require("aws-sdk");
http.createServer(function (req, res) 
{
          res.writeHead(200, {'Content-Type': 'text/plain'});
          var q = url.parse(req.url, true);
          var q2 = url.parse(req.url,true).query;
        let awsConfig = {
            "region": "us-east-1",
            "endpoint": "http://dynamodb.us-east-1.amazonaws.com",
            "accessKeyId": "AKIAJ2BYR2BMXVR2TI6A", "secretAccessKey": "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"
            };
          AWS.config.update(awsConfig);
            var docClient = new AWS.DynamoDB.DocumentClient();
          switch (q.pathname) 
          {
                case "/dangbai":
                    var id=q2.txtid+"";
                    var tieude =q2.txttieude+"";
                    var noidung = q2.txtnoidung;
                    var params = {
                        TableName:"WebDocBao",
                        Item:{
                            "ID":id,
                            "TieuDe": tieude,
                            "NoiDung": noidung,
                        }
                    };
                    docClient.put(params, function(err, data) {
                        if (err) {
                            console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
                        } else {
                            res.writeHead(200, {'Content-Type': 'text/html'})
                            var text = "<!DOCTYPE html>" +
                                "<html lang=\"en\">" +
                                "<head>" +
                                "    <meta charset=\"UTF-8\">" +
                                "    <title>Title</title>" +
                                "<link rel='stylesheet' href='https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css' integrity='sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO' crossorigin='anonymous'>"+
                                "</head>" +
                                "<body>" +
                                "<nav aria-label='breadcrumb'>"+
                                "<ol class='breadcrumb'>"+
                                "<li class='breadcrumb-item'><a href='http://localhost:8081/'>Trang Chu</a></li>"+
                                "<li class='breadcrumb-item'><a href='http://localhost:8081/dangbai'>Dang Bai</a></li>"+
                                "</ol>"+
                                "</nav>"+
                                "<form action='/dangbai'  method='put' name='form1'>"+
                            //    "<div class='alert alert-primary' role='alert'>A simple primary alert—check it out! </div>"+
                                "<p>ID </br>"+
                               // "<input type= 'text' name='txttieude' value='"+td+"'></p>"+
                               "<textarea rows='1' cols='2' name='txtid' value='"+id+"'> </textarea>"+
                               "<br/>"+
                               "<p>Tieu De Bao </br>"+
                               "<textarea rows='1' cols='35' name='txttieude' value='"+tieude+"'> </textarea>"+
                               "<br/>"+
                               "<p>Noi Dung </br>"+
                              //  "<input type= 'text' name='txtnoidung' value='"+noidung+"'></p>"+
                                "<textarea rows='10' cols='85' name='txtnoidung' value='"+noidung+"'> </textarea>"+
                                "<br/>"+
                                "<input type='submit' value='Dang Bai'>"+
                                "</form></br>"
                            res.write(text);
                            res.end();
                            return;
                        }
                    });
                    break;
                    case "/GetAll":
                    var params = {
                      TableName: "WebDocBao",
                      ProjectionExpression: "#id,#tieude,#noidung",
                      ExpressionAttributeNames: {
                        "#id": "ID",
                        "#tieude": "TieuDe",
                        "#noidung": "NoiDung",
                      }
                  };
                    docClient.scan(params, onScan);
                      function onScan(err, data) {
                          if (err) {
                              console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
                          } else {
                              console.log("Scan succeeded.");
                              res.writeHead(200, {'Content-Type': 'text/html'})
                              var text = "<!DOCTYPE html>" +
                                  "<html lang=\"en\">" +
                                  "<head>" +
                                  "    <meta charset=\"UTF-8\">" +
                                  "    <title>Title</title>" +
                                  "<style>table, tr, th {border: 1px solid black;border-collapse: collapse;}</style>"+
                                  "</head>" +
                                  "<body>" +
                                //  "<img src='https://s3.amazonaws.com/elasticbea9nstalk-us-east-1-764505673709/hinh1.jpg' height='500px' width='100%'>"+``
                                  "<p>Danh sách tất cả các bai bao </p>"

                              //    +"<table style='width:80%'><tr><th>Tieu De</th></tr><tr><th>Noi Dung</th></tr><tr><th>Delete</th></tr>";
                              data.Items.forEach(function(item) {
                                  text +=  "<tr>" + item.ID+ "</tr>"
                                    +"</br>"
                                    +"</br>"
                                    + "<tr> "+ item.TieuDe+ "</tr>"
                                      +"</br>"
                                      +"</br>"
                                      + "<tr>" + item.NoiDung+ "</tr>"
                                      +"</br>"
                                      +"</br>"
                                      + "<tr><a href='http://localhost:8081/Delete?txtid=" +item.ID+ "&txttieude="+item.TieuDe+"'>Delete</a>\</tr>"
                                      +"</br>"
                                      +"</br>"
                                   
                              });
                              text +="</table>"+
                                  "</body>" +
                                  "</html>";
                              res.write(text);
                              res.end();
                              return;
                          }
                      }
                    break;
                    case "/Delete":
                    var id=q2.txtid;
                    var tieude =q2.txttieude;
                    var noidung = q2.txtnoidung;
                    var params = {
                        TableName:"WebDocBao",
                        Key:{
                            "ID":id,
                            "TieuDe": tieude,
                            "NoiDung": noidung,
                        },
                    };
                    docClient.delete(params, function(err, data) {
                        if (err) {
                            console.error("Unable to delete item. Error JSON:", JSON.stringify(err, null, 2));
                        } else {
                            res.writeHead(200, {'Content-Type': 'text/html'})
                            console.log("DeleteItem succeeded:", JSON.stringify(data, null, 2));
                            res.write("xoa thanh cong </br> <a href='./GetAll'>Quay lai danh sach</a>");
                            res.end();
                            return;
                        }
                    });
                    break;
                    case "/timBaiBao":
            var id = q2.txtid+"";
            var params = {
                TableName : "WebDocBao",
              //  ProjectionExpression: "#id,#tieude,#noidung",
                KeyConditionExpression: "#id = :iii" ,
                ExpressionAttributeNames:{
                    "#id": "ID",
                },
                ExpressionAttributeValues: {
                    ":iii":id
                },
            };
            docClient.query(params, function(err, data) {
                if (err) {
                    console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
                } else {
                    res.writeHead(200, {'Content-Type': 'text/html'})
                    
                    var text = "<form action='/timBaiBao'  method='get' name='form1'>"+
                        "</p>Nhap ID </br>"+
                        "<input type= 'text' name='txtid' value='"+id+"'></p>"+
                        "<input type='submit' value='Search'>"+
                        "<INPUT type='reset'  value='reset'>"+
                        "</form></br>"
                        +"<table><tr><th>ID</th><th>Tieu De</th><th>Noi Dung</th></tr>";
                    data.Items.forEach(function(item) {
                        text = "<!DOCTYPE html>" +
                                  "<html lang=\"en\">" +
                                  "<head>" +
                                  "    <meta charset=\"UTF-8\">" +
                                  "    <title>Title</title>" +
                                  "<style>table, tr, th {border: 1px solid black;border-collapse: collapse;}</style>"+
                                  "</head>" +
                                  "<body>" +
                                  "<p>Danh sách tất cả các bai bao tìm được</p>"
                        text += "<tr><td>" +item.TieuDe+ "</td>"
                                        + "</br>"
                                        + "</br>"
                                        + "</br>"
                                     + "<td>" + item.NoiDung + "</td>"
                                     +"</tr>";
                    });
                    text +="</table>"+
                        "</body>" +
                        "</html>";
                    res.write(text);
                    res.end();
                    console.log("Query succeeded");
                    return;

                }
            });
            break;
            case "/baobongda":
           // var id=q2.txtid+"";
            var params = {
                TableName : "WebDocBao",
              //  ProjectionExpression: "#id,#tieude,#noidung",
                KeyConditionExpression: "#id = :iii" ,
                ExpressionAttributeNames:{
                    "#id": "ID",
                },
                ExpressionAttributeValues: {
                    ":iii":"ID2"
                }
            };
            docClient.query(params, function(err, data) {
                if (err) {
                    console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
                } else {
                    res.writeHead(200, {'Content-Type': 'text/html'})
                    var text = "<!DOCTYPE html>" +
                        "<html lang=\"en\">" +
                        "<head>" +
                        "    <meta charset=\"UTF-8\">" +
                        "    <title>Title</title>" +
                        "<style>table, tr, th {border: 1px solid black;border-collapse: collapse;}</style>"+
                        "</head>" +
                        "<body>" +
        
                        "<p>Bánh Lăn Trong Và Ngoài Nước</p>"

                  
                    data.Items.forEach(function(item) {
                        text +=  "<tr>" + item.TieuDe+ "</tr>"
                          +"</br>"
                            +"</br>"
                            +"</br>"
                            + "<tr>" + item.NoiDung+ "</tr>"
                            +"</br>"
                            +"</br>"
                            +"</br>"
                         
                    });
                    text +="</table>"+
                        "</body>" +
                        "</html>";
                    res.write(text);
                    res.end();
                    return;
                }
            });
            break;
            case "/thoisu":
            // var id=q2.txtid+"";
             var params = {
                 TableName : "WebDocBao",
               //  ProjectionExpression: "#id,#tieude,#noidung",
                 KeyConditionExpression: "#id = :iii" ,
                 ExpressionAttributeNames:{
                     "#id": "ID",
                 },
                 ExpressionAttributeValues: {
                     ":iii":"ID3"
                 }
             };
             docClient.query(params, function(err, data) {
                 if (err) {
                     console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
                 } else {
                    res.writeHead(200, {'Content-Type': 'text/html'})
                    var text = "<!DOCTYPE html>" +
                        "<html lang=\"en\">" +
                        "<head>" +
                        "    <meta charset=\"UTF-8\">" +
                        "    <title>Title</title>" +
                        "<style>table, tr, th {border: 1px solid black;border-collapse: collapse;}</style>"+
                        "</head>" +
                        "<body>" +
        
                        "<p>Báo Thời Sự Trong Và Ngoài Nước</p>"

                  
                    data.Items.forEach(function(item) {
                        text +=  "<tr>" + item.TieuDe+ "</tr>"
                          +"</br>"
                            +"</br>"
                            +"</br>"
                            + "<tr>" + item.NoiDung+ "</tr>"
                            +"</br>"
                            +"</br>"
                            +"</br>"
                         
                    });
                    text +="</table>"+
                        "</body>" +
                        "</html>";
                    res.write(text);
                    res.end();
                    return;
                 }
             });
             break;
             case "/Login":
             fs.readFile('Login.html', function (err, data) {
                 res.writeHead(200, {'Content-Type': 'text/html'})
                 if (err) {
                     res.writeHead(404, {'Content-Type': 'text/html'});
                     return res.end("404 Not Found Home Page");
                 }
                 res.writeHead(200, {'Content-Type': 'text/html'});
                 res.write(data);
                 res.end();
                 }); 
             break;
                    default:
            fs.readFile('./indext.html', function (err, data) {
                res.writeHead(200, {'Content-Type': 'text/html'})
                if (err) {
                    res.writeHead(404, {'Content-Type': 'text/html'});
                    return res.end("404 Not Found Home Page");
                }
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.write(data);
                res.end();
            });
            
             }
            
}).listen(8081);