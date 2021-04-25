import React, { useRef } from 'react';
import { Input } from 'antd';
import PropTypes from 'prop-types';
import 'antd/lib/input/style';
import 'antd/lib/button/style';
const inputRef = React.createRef();
class InputNumber extends React.Component {
  constructor(props) {
    super(props)
    this.breakValue = this.breakValue.bind(this)
    this.filter = this.filter.bind(this)
    this.getFocusIndex = this.getFocusIndex.bind(this)
    this.handleBlur = this.handleBlur.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  breakValue(val) {
    const a = 7;
    console.log(a)
    const { config, value, onChange, onInput, onFocus, onBlur, addonAfter, className } = this.props;
     let newVal = val;
    if (config.max > 0 && val > parseFloat(config.max)) {
      newVal = config.max;
    } else if (config.min < 0 && val < parseFloat(config.min)) {
      newVal = config.min;
    }
    return newVal;
  };

  filter(){
    const { config, value, onChange, onInput, onFocus, onBlur, addonAfter, className } = this.props;
    // debugger;
    let newValue = value ? `${value}` : '';
    if (!value) {
      return '';
    }
    // removeZero 是否移除数字前面的0   false 不移除
    if (config.removeZero) {
      newValue = newValue.replace(/^0+([^0]+)/, '$1');
    }
    if (/^0+$/.test(newValue)) {
      newValue = '0';
    } else {
      newValue = newValue
        .replace(/^\./, '0.') // 小数点在首位补0
        .replace(/^\-\./, '-0.') // -.9补零-0.9
        .replace(/\.$/, ''); // 末尾的小数点替换成''
    }
    if (config.removeZero) {
      newValue = newValue.replace(/^[0]+/, '0');
    }
    if (!newValue || (!config.zero && !parseFloat(newValue))) {
      return '';
    }
    newValue = this.breakValue(newValue);
    // 补零
    if (config.decimal && config.zeroize) {
      const arr = newValue.split('.');
      const integer = arr[0];
      let decimal = (arr[1] || '').replace(/0+$/, '');
      let count = config.zeroize - decimal.length;
      while (count > 0) {
        decimal += '0';
        count -= 1;
      }
      newValue = `${integer}.${decimal}`;
    }
    return newValue;
  };

  handleBlur (e) {
    const {  value, onChange, onBlur } = this.props;
    const val = this.filter(value);
    onChange(val);
    // 事件源要传递 不然value会丢
    typeof onBlur === 'function' && onBlur(val);
  };

  getFocusIndex(element) {
    const val = element.state.value; // ? 去空格
    let index = val.length;
    if (element.input.setSelectionRange) {
      index = element.input.selectionStart;
    } else {
      // ie
      try {
        const temp = document.selection.createRange();
        const textRange = element.input.createTextRange();
        textRange.setEndPoint('endtoend', temp);
        index = textRange.text.length;
      } catch (e) {}
    }
    return index;
  };

  handleChange (e) {
    const { config, onChange, onInput } = this.props;
    let minus = '';
    let integer = '';
    let decimal = '';
    const el = inputRef.current; // 当前input元素
    let index = this.getFocusIndex(el); // 获取焦点位置
    const { length } = e.target.value;
    // 过滤非数字减号加号小数点符号
    let val = e.target.value.replace(/[^\+\-\d\.]+/g, '');
    // 存储负数符号
    if (config.minus && val.split('-').length % 2 === 0) {
      minus = '-';
      if (val.indexOf('+') !== -1) {
        minus = '';
      }
    }
    val = val.replace(/[-+]/g, '');
    const temp = val.split('.');
    integer = temp[0] || '';
    if (config.integer) {
      integer = integer.substr(0, config.integer);
    }
    if (config.decimal && val.indexOf('.') > -1) {
      decimal = `.${(temp[1] || '').substr(0, config.decimal)}`;
    }
    val = this.breakValue(minus + integer + decimal);
    index += val.length - length;

    // 当输入字母及特殊符号时（会重新赋值），焦点会闪一下
    setTimeout(() => el.input.setSelectionRange(index, index), 0);
    // el.input.setSelectionRange(index, index);

    onChange(val);
    if (typeof onInput === 'function') {
      onInput(val);
    }
  };

  render() {
    const { config, onChange, onInput, onFocus, onBlur, ...restProps } = this.props;
    return <Input
      ref={inputRef}
      onChange={this.handleChange}
      onBlur={this.handleBlur}
      autoComplete="off"
      {...restProps}
    />
  }
}

InputNumber.propTypes = {
  // eslint-disable-next-line react/require-default-props
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  // eslint-disable-next-line react/require-default-props
  onChange: PropTypes.func,
  config: PropTypes.shape({
    integer: PropTypes.number,
    decimal: PropTypes.number,
    max: PropTypes.number,
    min: PropTypes.number,
    zeroize: PropTypes.number,
    zero: PropTypes.bool,
    minus: PropTypes.bool,
    removeZero: PropTypes.bool,
  }),
  addonAfter: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
};
InputNumber.defaultProps = {
  addonAfter: null,
  config: {
    integer: 4, // 整数长度
    decimal: 2, // 小数长度
    max: 0, // 设置正数最大值
    min: 0, // 设置负数最小值
    zeroize: 0, // 补零位数
    zero: false, // 是否允许值为0
    minus: false, // 是否允许值为负数
    removeZero: true, // 是否移除整数部分前面的0
  },
};
export default InputNumber;
