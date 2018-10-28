<?php
require_once './../models/photos.php';
require_once './../models/project.php';

if(isset( $_POST['addProject'] )) {
    $data = json_decode($_POST['addProject'],true);
    $result = project::addProject($data);
    echo $result;
}

if(isset($_GET['getProjects'])){
    $data = project::getProjectList();
    echo json_encode($data); 
}

if(isset( $_POST['deleteProject'] )) {
    $result = project::deleteProject($_POST['deleteProject']);
    echo $result;
}

if(isset($_GET['getPhotos'])){
    $photos = photos::getPhotoList($_GET['getPhotos']);
    echo json_encode($photos);
}

if(isset( $_POST['addPhotos'] )) {
    $errors = photos::addPhotos($_FILES,json_decode($_POST['addPhotos']));
    echo json_encode($errors);
}

if(isset( $_POST['deletePhoto'] )) {
    $result = photos::deletePhoto($_POST['deletePhoto'], $_POST['project_id']);
    echo $result;
}