<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PedidosResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'idCliente' => $this->idCliente,
            'pedidoCliente' => $this->pedidoCliente,
            'quantidadePedida' => $this->quantidadePedida,
            'morada' => $this->morada,
            'nif' => $this->nif,
        ];
    }
}
