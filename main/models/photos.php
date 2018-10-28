<?php

include './../db/db.php';
class photos
{
    public $name,$extencion,$path;

    function __construct($name=null, $extencion=null,$path=null)
    {
        $this->name = $name;
        $this->photos = $extencion;
        $this->created = $path;
    }

    public static function addPhotos($photos,$id)
    {
        $update = array();
        $error = [];
        $check = scandir('./../../images');
        foreach($photos as $photo){
             if(in_array($photo['name'],$check)){
                array_push($error,$photo['name']);
             }else{
                rename($photo["tmp_name"],'./../../images/'. $photo['name'] );
                $sql = "INSERT INTO photos (name,extencion,path) VALUES (?,?,?)";
                $stmt= DB::prepare($sql);
                $stmt->execute([$photo['name'],$photo['type'],'images/'.$photo['name']]);
                $last_id = DB::lastInsertId();
                array_push($update,$last_id);
             }
        }
        $sql = "UPDATE projects SET photos=CONCAT_WS(',', photos, ?)  WHERE id=?";
        $stm = DB::prepare($sql);
        $stm->execute([join(",",$update),$id]);
        if(count($error)>0){
            return $error;
        }else{
            return 1;
        }
    }
    public static function getPhotoList($id)
    {
        $sql = "SELECT photos FROM projects WHERE id=?";
        $stmt = DB::prepare($sql);
        $stmt->execute([$id]);
        $result = $stmt->fetchAll();
        if(count($result)==0){
            return 0;
        }else{
            $photos = explode(',',$result[0]['photos']);
            $in  = str_repeat('?,', count($photos) - 1) . '?';
            $sql = "SELECT id,path FROM photos WHERE id IN ($in)";
            $stm = DB::prepare($sql);
            $stm->execute($photos);
            $res = $stm->fetchALL();
            if(count($res)==0){
                return 0;
            }else{
                return $res;
            }
        }
        
    }
    public static function deletePhoto($photo_id,$project_id)
    {
        $sql = "UPDATE projects SET photos =  REPLACE(photos, CONCAT(',',?), '') WHERE id=?";
        $stm = DB::prepare($sql);
        $stm->execute([$photo_id,$project_id]);
        $sql = "DELETE FROM photos WHERE id = ?";
        $stmt = DB::prepare($sql);
        $stmt->execute([$photo_id]);
        var_dump($stmt);
    }
}