<?php

namespace App\Http\Controllers\Api;

use App\Models\Pedido;
use App\Http\Controllers\Controller;
use App\Http\Requests\StorePedidoRequest;
use App\Http\Requests\UpdatePedidoRequest;
use App\Http\Resources\PedidoResource;


class PedidoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return PedidoResource::collection(Pedido::query()->orderBy('id', 'desc')->paginate(100));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePedidoRequest $request)
    {
        $data = $request->all();
        $pedido = Pedido::create($data);

        return response (new PedidoResource($pedido), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Pedido $pedido)
    {
        return new PedidoResource($pedido);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePedidoRequest $request, Pedido $pedido)
    {
        $data = $request->validated();
        $pedido->update($data);

        return new PedidoResource($pedido);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Pedido $pedido)
    {
        $pedido->delete();

        return response("", 204);
    }
}
