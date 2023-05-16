<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class ImageController extends Controller
{
    public function uploadImage(Request $request)
    {
        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $name = $request->input('name'); // Get the value of user.name
            $extension = $file->getClientOriginalExtension();
            $filename = $name . '.' . $extension; // Use only the value of user.name as the filename
            $file->storeAs('images/', $filename, 'public');
            return response()->json(["message" => "Successfully uploaded an image"]);
        } else {
            return response()->json(["message" => "You must select the image first"]);
        }
    }
}