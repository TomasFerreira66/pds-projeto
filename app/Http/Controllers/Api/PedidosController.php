<?php

namespace App\Http\Controllers\Api;

use App\Models\Pedidos;
use App\Http\Controllers\Controller;
use App\Http\Requests\StorePedidosRequest;
use App\Http\Requests\UpdatePedidosRequest;

class PedidosController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return PedidosResource::collection(Pedidos::query()->orderBy('id', 'desc')->paginate(100));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePedidosRequest $request)
    {
        $data = $request->all();
        $pedidos = Pedidos::create($data);

        return response (new PedidosResource($pedidos), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Pedidos $pedidos)
    {
        return new PedidosResource($pedidos);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePedidosRequest $request, Pedidos $pedidos)
    {
        $data = $request->validated();
        $pedidos->update($data);

        return new PedidosResource($pedidos);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Pedidos $pedidos)
    {
        $pedidos->delete();

        return response("", 204);
    }
}
