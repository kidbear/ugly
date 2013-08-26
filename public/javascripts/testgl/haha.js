var f = function(){
	var _e = NEJ.P('nej.e'),
		_u = NEJ.P('nej.u');

	var _canvas = _e._$get('firstCanvas'),
		_gl,_shaderProgram,_triangleVertexPositionBuffer,
		_triangleVertexColorBuffer,
		_pMatrix,_mvMatrix,_rTri=0,_rSquare=0,_lastTime=0,
		_mvMatrix,_mvMatrixStack=[];

	var _mvPushMatrix = function() {
        var copy = new okMat4();
        _mvMatrix.clone(copy);
        _mvMatrixStack.push(copy);
    }

    var _mvPopMatrix = function() {
        if (_mvMatrixStack.length == 0) {
            throw "Invalid popMatrix!";
        }
        _mvMatrix = _mvMatrixStack.pop();
    }
	var _setMatrixUniforms = function() {
        _gl.uniformMatrix4fv(_shaderProgram.pMatrixUniform, false, _pMatrix.toArray());
        _gl.uniformMatrix4fv(_shaderProgram.mvMatrixUniform, false, _mvMatrix.toArray());
    }
	var _initGL = function(){
	    try {
	        _gl = _canvas.getContext("experimental-webgl");
	        _gl.viewportWidth = _canvas.width;
	        _gl.viewportHeight = _canvas.height;
	    } catch (e) {
	    	alert("I caught an exception!");
	    }
	    if (!_gl) {
	        alert("Could not initialise WebGL, sorry :-(");
	    }
    }
    var _getShader = function(_gl,_glid){
    	var _shaderScript = _e._$get(_glid);
        if (!_shaderScript) {
            return null;
        }

        var str = "";
        var k = _shaderScript.firstChild;
        while (k) {
            if (k.nodeType == 3) {
                str += k.textContent;
            }
            k = k.nextSibling;
        }
        // _u._$forEach(_e._$getChildren(_shaderScript),function(_itm){
        // 	str += _itm.textContent;
        // });

        var _shader;
        if (_shaderScript.type == "x-shader/x-fragment") {
            _shader = _gl.createShader(_gl.FRAGMENT_SHADER);
        } else if (_shaderScript.type == "x-shader/x-vertex") {
            _shader = _gl.createShader(_gl.VERTEX_SHADER);
        } else {
            return null;
        }

        _gl.shaderSource(_shader, str);
        _gl.compileShader(_shader);

        if (!_gl.getShaderParameter(_shader, _gl.COMPILE_STATUS)) {
            alert(_gl.getShaderInfoLog(_shader));
            return null;
        }

        return _shader;
    }
    var _initShader = function(){
    	var _fragmentShader = _getShader(_gl, "shader-fs");
        var _vertexShader = _getShader(_gl, "shader-vs");

        _shaderProgram = _gl.createProgram();
        _gl.attachShader(_shaderProgram, _vertexShader);
        _gl.attachShader(_shaderProgram, _fragmentShader);
        _gl.linkProgram(_shaderProgram);

        if (!_gl.getProgramParameter(_shaderProgram, _gl.LINK_STATUS)) {
            alert("Could not initialise shaders");
        }

        _gl.useProgram(_shaderProgram);

        _shaderProgram.vertexPositionAttribute = _gl.getAttribLocation(_shaderProgram, "aVertexPosition");
        _gl.enableVertexAttribArray(_shaderProgram.vertexPositionAttribute);

        _shaderProgram.vertexColorAttribute = _gl.getAttribLocation(_shaderProgram, "aVertexColor");
        _gl.enableVertexAttribArray(_shaderProgram.vertexColorAttribute);

        _shaderProgram.pMatrixUniform = _gl.getUniformLocation(_shaderProgram, "uPMatrix");
        _shaderProgram.mvMatrixUniform = _gl.getUniformLocation(_shaderProgram, "uMVMatrix");
    }
    var _initBuffer = function(){
    	_triangleVertexPositionBuffer = _gl.createBuffer();
        _gl.bindBuffer(_gl.ARRAY_BUFFER, _triangleVertexPositionBuffer);
        var _vertices = [
             0.0,  1.0,  0.0,
            -1.0, -1.0,  0.0,
             1.0, -1.0,  0.0
        ];
        _gl.bufferData(_gl.ARRAY_BUFFER, new Float32Array(_vertices), _gl.STATIC_DRAW);
        _triangleVertexPositionBuffer.itemSize = 3;
        _triangleVertexPositionBuffer.numItems = 3;

        _triangleVertexColorBuffer = _gl.createBuffer();
        _gl.bindBuffer(_gl.ARRAY_BUFFER, _triangleVertexColorBuffer);
        var colors = [
            1.0, 0.0, 0.0, 1.0,
            0.0, 1.0, 1.0, 0.5,
            0.0, 0.0, 1.0, 0.2,
        ];
        _gl.bufferData(_gl.ARRAY_BUFFER, new Float32Array(colors), _gl.STATIC_DRAW);
        _triangleVertexColorBuffer.itemSize = 4;
        _triangleVertexColorBuffer.numItems = 3;
    }

    var _drawScene = function(){
    	_gl.viewport(0, 0, _gl.viewportWidth, _gl.viewportHeight);
        _gl.clear(_gl.COLOR_BUFFER_BIT | _gl.DEPTH_BUFFER_BIT);

        _pMatrix = okMat4Proj(45, _gl.viewportWidth / _gl.viewportHeight, 0.1, 100.0);
        _mvMatrix = new okMat4();

        _mvPushMatrix();
        _mvMatrix.translate(OAK.SPACE_WORLD, -1.5, 0.0, -7.0, true);
        _mvMatrix.rotX(OAK.SPACE_LOCAL, _rTri, true);
        // mvMatrix.rotY(OAK.SPACE_LOCAL, rTri, true);
        // mvMatrix.rotZ(OAK.SPACE_WORLD, rTri, true);
        _gl.bindBuffer(_gl.ARRAY_BUFFER, _triangleVertexPositionBuffer);
        _gl.vertexAttribPointer(_shaderProgram.vertexPositionAttribute, _triangleVertexPositionBuffer.itemSize, _gl.FLOAT, false, 0, 0);

        _gl.bindBuffer(_gl.ARRAY_BUFFER, _triangleVertexColorBuffer);
        _gl.vertexAttribPointer(_shaderProgram.vertexColorAttribute, _triangleVertexColorBuffer.itemSize, _gl.FLOAT, false, 0, 0);

        _setMatrixUniforms();
        _gl.drawArrays(_gl.TRIANGLES, 0, _triangleVertexPositionBuffer.numItems);
        _mvPopMatrix();
    }

    var _animate = function(){
    	var _timeNow = new Date().getTime();
        if (_lastTime != 0) {
            var _elapsed = _timeNow - _lastTime;

            _rTri += (90 * _elapsed) / 1000.0;
            _rSquare += (75 * _elapsed) / 1000.0;
        }
        _lastTime = _timeNow;
    }

    var _tick = function(){
    	okRequestAnimationFrame(_tick);
        _drawScene();
        _animate();
    }

    var _init = function(){
    	_initGL();
    	_initShader();
    	_initBuffer();
    	//_gl.clearColor(0.0, 0.0, 0.0, 1.0);
        _gl.enable(_gl.DEPTH_TEST);

        _tick();
    }
    _init();
};
define('',['{lib}base/element.js'],f);