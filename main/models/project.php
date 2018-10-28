<?php

class project
{
   public $name,$created;

   function __construct($name=null,$created=null)
    {
        $this->name = $name;
        $this->created = $created;
    }
    public static function addProject($project)
    {
        $sql = "INSERT INTO projects (name,created) VALUES (?,?)";
        $stmt= DB::prepare($sql);
        $stmt->execute([$project['name'],$project['created']]);
    }
    public static function getProjectList()
    {
       $sql = "SELECT * FROM projects";
       $stmt = DB::prepare($sql);
       $stmt->execute();
       $result = $stmt->fetchAll();
       return $result;
    }
    public static function deleteproject($id)
    {
        $sql = "DELETE FROM projects WHERE id =  :projectID";
        $stmt = DB::prepare($sql);
        $stmt->bindParam(':projectID', $id, PDO::PARAM_INT);   
        $stmt->execute();
    }
}