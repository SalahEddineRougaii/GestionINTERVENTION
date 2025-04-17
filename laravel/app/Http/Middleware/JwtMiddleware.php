<?php


namespace App\Http\Middleware;

use Closure;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use Illuminate\Http\Request;

class JwtMiddleware
{
    /**
     * Gérer l'entrée de la requête.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        try {
            // Vérifier si un token JWT est présent et valide
            if (! $user = JWTAuth::parseToken()->authenticate()) {
                return response()->json(['error' => 'Utilisateur non autorisé'], 401);
            }
        } catch (JWTException $e) {
            return response()->json(['error' => 'Token non valide'], 401);
        }

        // Ajouter l'utilisateur authentifié à la requête pour l'utiliser dans les contrôleurs
        $request->attributes->add(['user' => $user]);

        return $next($request);
    }
}
