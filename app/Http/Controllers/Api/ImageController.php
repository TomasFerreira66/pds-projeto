<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;

class ImageController extends Controller
{
    public function uploadImage(Request $request)
    {
        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $name = $request->input('name'); // Get the value of user.name
            $filename = $name . '.png'; // Set the file extension to PNG
            
            // Store the image in Laravel project's storage folder
            $file->storeAs('public/storage/images', $filename);
            
            // Copy the image to the react/src/img folder
            $file->move('C:/Users/tomas/OneDrive/Documents/GitHub/pds-projeto/react/src/img', $filename);
            
            return response()->json(["message" => "Successfully uploaded an image"]);
        } else {
            return response()->json(["message" => "You must select the image first"]);
        }
    }
}