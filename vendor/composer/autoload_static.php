<?php

// autoload_static.php @generated by Composer

namespace Composer\Autoload;

class ComposerStaticInitdf16216aea80a9d829b420219835d63f
{
    public static $prefixLengthsPsr4 = array (
        'm' => 
        array (
            'models\\' => 7,
        ),
        'c' => 
        array (
            'controllers\\classes\\' => 20,
        ),
    );

    public static $prefixDirsPsr4 = array (
        'models\\' => 
        array (
            0 => __DIR__ . '/../..' . '/models',
        ),
        'controllers\\classes\\' => 
        array (
            0 => __DIR__ . '/../..' . '/controllers/classes',
        ),
    );

    public static $fallbackDirsPsr4 = array (
        0 => __DIR__ . '/../..' . '/src',
    );

    public static $classMap = array (
        'Composer\\InstalledVersions' => __DIR__ . '/..' . '/composer/InstalledVersions.php',
    );

    public static function getInitializer(ClassLoader $loader)
    {
        return \Closure::bind(function () use ($loader) {
            $loader->prefixLengthsPsr4 = ComposerStaticInitdf16216aea80a9d829b420219835d63f::$prefixLengthsPsr4;
            $loader->prefixDirsPsr4 = ComposerStaticInitdf16216aea80a9d829b420219835d63f::$prefixDirsPsr4;
            $loader->fallbackDirsPsr4 = ComposerStaticInitdf16216aea80a9d829b420219835d63f::$fallbackDirsPsr4;
            $loader->classMap = ComposerStaticInitdf16216aea80a9d829b420219835d63f::$classMap;

        }, null, ClassLoader::class);
    }
}
