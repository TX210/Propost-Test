<?php
require_once "./main/db/db.php";
$sql  = "CREATE TABLE projects (
    id int NOT NULL AUTO_INCREMENT,
    name text,
    photos text DEFAULT NULL,
    created date,
    PRIMARY KEY (id)
  );
  CREATE TABLE photos(
    id int NOT NULL AUTO_INCREMENT,
    name text,
    extencion text,
    path text,
    PRIMARY KEY (id)
  );";
$migrate = DB::prepare($sql);
$migrate->execute();