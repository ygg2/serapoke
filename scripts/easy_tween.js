function lerp(a, b, amt) {
  return (1 - amt) * a + amt * b;
}

function easy_tween(type, start, end, position, Option1, Option2) {
/// @description easy_tween
/// @param type
/// @param start
/// @param end
/// @param position
/// @param  <Option1>
/// @param  <Option2>

var _type = clamp(argument[0],0,TweenType.count);
var _start = argument[1];
var _end = argument[2];
var _pos = argument[3];
var _chng = _end-_start;
var _mid = (_start+_end) / 2;

//region Tween Types
TweenType =
{
	linear: 1,
	inout_back: 2,	in_back: 3, out_back: 4,
	inout_bounce: 5,	out_bounce: 6, in_bounce: 7,
	inout_circle: 8,	out_circle: 9, in_circle: 10,
	inout_cubic: 11,	out_cubic: 12, 	in_cubic: 13,
	inout_elastic: 14, out_elastic: 15,	in_elastic: 16,
	inout_expo: 17,	out_expo: 18,	in_expo: 19,
	inout_quad: 20,	out_quad: 21,	in_quad: 22,
	inout_quart: 23, out_quart: 24, in_quart: 25,
	inout_quint: 26, out_quint: 27, in_quint: 28,
	inout_sine: 29, out_sine: 30, in_sine: 31,
	count: 32
}
//endregion

	const EasyTween_Bounce_DefaultBounciness = 7.5625;

	const EasyTween_Bounce_Bounce1_Pos = 1/2.75;
	const EasyTween_Bounce_Bounce2_Pos = 2/2.75;
	const EasyTween_Bounce_Bounce3_Pos = 2.25/2.75;
	const EasyTween_Bounce_Bounce1_Change = 1.5/2.75;
	const EasyTween_Bounce_Bounce2_Change = 2.25/2.75;
	const EasyTween_Bounce_Bounce3_Change = 2.625/2.75;

	const EasyTween_Back_DefaultBounciness = 1.5;

	const EasyTween_Sine_Half_Pi = 1.57079632679;

switch(_type)
{
	case TweenType.linear: return lerp(_start,_end,_pos); //Why are you using this?
	//region Back
	// Optional Argument: Bounciness - Default: 1.5
	case TweenType.inout_back:
				var _b = Option1 || EasyTween_Back_DefaultBounciness;	
				return (_pos < .5) ? easy_tween(TweenType.in_back,_start,_mid,_pos*2,_b) 
												   : easy_tween(TweenType.out_back,_mid,_end,(_pos-.5)*2,_b);

	case TweenType.in_back:
				var _b = Option1 || EasyTween_Back_DefaultBounciness;
				return _chng * (_pos) * _pos * ((_b + 1) * _pos - _b) + _start

	case TweenType.out_back:			
				var _b = Option1 || EasyTween_Back_DefaultBounciness;
				_pos -= 1;
				return _chng * (_pos * _pos * ((_b + 1) * _pos + _b) + 1) + _start;
				
	//endregion
	//region Bounce
	//No Optional Arguments
	
	case TweenType.inout_bounce:
			return (_pos < 0.5) ? easy_tween(TweenType.in_bounce,_start, (_start + _end) / 2, _pos*2)
												  : easy_tween(TweenType.out_bounce,(_start + _end) / 2, _end, (_pos-.5)*2);
												
	case TweenType.out_bounce:
				if (_pos < 1/2.75) 
					return _chng * (EasyTween_Bounce_DefaultBounciness * _pos * _pos) + _start;
				else if (_pos < 2/2.75) 
				{
				  _pos -= 1.5/2.75; 
				  return _chng * (EasyTween_Bounce_DefaultBounciness * _pos * _pos + 3/4) + _start;
				}
				else if (_pos < 2.5/2.75)
				{
				  _pos -= 2.25/2.75; 
				  return _chng * (EasyTween_Bounce_DefaultBounciness * _pos * _pos + 15/16) + _start; 
				}

				_pos -= 2.625/2.75;
				return _chng * (EasyTween_Bounce_DefaultBounciness * _pos * _pos + 63/64) + _start;
				
	case TweenType.in_bounce:
				var _chng = _end-_pos;
				var _pos = 1-_pos;
				return _chng - easy_tween(TweenType.out_bounce,_start,_end,_pos,EasyTween_Bounce_DefaultBounciness)+_start;
				
	//endregion
	//region Circle
	//No Optional Arguments
	case TweenType.inout_circle:
				return (_pos < .5) ? easy_tween(TweenType.in_circle,_start,_mid,_pos*2)
												   : easy_tween(TweenType.out_circle,_mid,_end,(_pos-.5)*2);
												 
	case TweenType.out_circle:
				_pos--;
				return _chng * sqrt(1 - _pos * _pos) + _start;
				
	case TweenType.in_circle:
				return -_chng * (sqrt(1 - _pos*_pos)-1) + _start;
				
	//endregion
	//region Cubic
	//No Optional Arguments
	case TweenType.inout_cubic:
				return (_pos < .5) ? easy_tween(TweenType.in_cubic,_start,_mid,_pos*2) 
												   : easy_tween(TweenType.out_cubic,_mid,_end,(_pos-.5)*2);
	case TweenType.out_cubic:
				return _chng * (power(_pos - 1, 3) + 1) + _start;
	case TweenType.in_cubic:
				return _chng * power(_pos, 3) + _start;
	//endregion
	//region Elastic
	// Optional Argument 1: Elasticity <0-1> - Default: .3
	// Optional Argument 2: Duration - Default: 5
	case TweenType.inout_elastic:
				var _e = Option1 || 0.3;
				var _d = Option2 || 5.0;
				
				return (_pos < .5) ? easy_tween(TweenType.in_elastic,_start,_mid,_pos*2,_e,_d)
												   : easy_tween(TweenType.out_elastic,_mid,_end,(_pos-.5)*2,_e,_d);
												 
	case TweenType.out_elastic:
				var _s,_p;
				var _e = Option1 || 0.3;
				var _d = Option2 || 5.0;

				if (_pos == 0 || _chng == 0) return _start;
				if (_pos == 1) return _end;

				_p = _d * _e;
				_s = (sign(_chng) == -1) ? _p * 0.25 : _p / (2 * Math.PI) * Math.asin(1);

				return _chng * Math.pow(2, -10 * _pos) * Math.sin((_pos * _d - _s) * (2 * pi) / _p ) + _chng + _start;
	case TweenType.in_elastic:
				var _s,_p;
				
				var _e = Option1 || 0.3;
				var _d = Option2 || 5.0;

				if (_pos == 0 || _chng == 0) return _start; 
				if (_pos == 1) return _end;

				_p = _d * _e;
				_s = sign(_chng) == -1 ? _p * 0.25 : _p / (2 * Math.PI) * Math.asin(1);

				return -(_chng * Math.pow(2,10 * (--_pos)) * Math.sin((_pos * _d - _s) * (Math.PI * 2) / _p)) + _start;

	//endregion
	//region Expo
	//No Optional arguments
	case TweenType.inout_expo:
			  return (_pos < .5) ? easy_tween(TweenType.in_expo,_start,_mid,_pos*2) 
												   : easy_tween(TweenType.out_expo,_mid,_end,(_pos-.5)*2);
												 
	case TweenType.out_expo:
				return _chng * (-power(2, -10 * _pos) + 1) + _start;
				
	case TweenType.in_expo:
				return _chng * power(2, 10 * (_pos - 1)) + _start;
				
	//endregion
	//region Quad
	//No Optional Arguments
	case TweenType.inout_quad:
				return (_pos < .5) ? easy_tween(TweenType.in_quad,_start,_mid,_pos*2) 
												   : easy_tween(TweenType.out_quad,_mid,_end,(_pos-.5)*2);
	case TweenType.out_quad:
				return -_chng * _pos * (_pos - 2) + _start;
				
	case TweenType.in_quad:
				return _chng * _pos * _pos + _start;

	//endregion
	//region Quart
	//No Optional Arguments
	case TweenType.inout_quart:
				return (_pos < .5) ? easy_tween(TweenType.in_quart,_start,_mid,_pos*2) 
												   : easy_tween(TweenType.out_quart,_mid,_end,(_pos-.5)*2);

	case TweenType.out_quart:
				return -_chng * (((_pos - 1) * (_pos - 1) * (_pos - 1) * (_pos - 1)) - 1) + _start;
				
	case TweenType.in_quart:
				return _chng * (_pos * _pos * _pos * _pos) + _start;
				
	//endregion
  //region Quint
	//No Optional Arguments
	case TweenType.inout_quint:
				return _pos < .5 ? easy_tween(TweenType.in_quint,_start,_mid,_pos*2) 
												 : easy_tween(TweenType.out_quint,_mid,_end,(_pos-.5)*2);
												 
	case TweenType.out_quint:
	
				return _chng * ((_pos - 1) * (_pos -1) * (_pos -1) * (_pos -1) * (_pos -1) + 1) + _start;
				
	case TweenType.in_quint:
				return _chng * _pos * _pos * _pos * _pos * _pos + _start;
				
	//endregion
	//region Sine
	//No Optional Arguments
	case TweenType.inout_sine:
				return _chng * 0.5 * (1 - cos(pi * _pos)) + _start;
				
	case TweenType.out_sine:
				return _chng * Math.sin(_pos * EasyTween_Sine_Half_Pi) + _start;
				
	case TweenType.in_sine:
				return _chng * (1 - Math.cos(_pos * EasyTween_Sine_Half_Pi)) + _start;
				
	//endregion
}

}