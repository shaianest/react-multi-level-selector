import React, { Component } from 'react';
import './MultiLevelSelector.css'

class MultiLevelSelector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      values: [],
    };
  }

  onOptionsChange = () => {
    const { onChange } = this.props;
    const { values } = this.state;
    onChange(values);
  }

  removeSelectedGroup = ({ value }) => {
    const { values } = this.state;
    this.setState({ values: values.filter(data => data.value !== value) }, this.onOptionsChange);
  }

  toggleMenu = (e) => {
    e.stopPropagation()
    this.props.setmenuopen(!this.props.menuopen);
  }

  matchtwoarray = (a, b) => { return a.every((val, index) => val === b[index]) }

  selectOption = (data, event) => {
    ;
    const { values } = this.state;
    const { value, checked } = event.target;
    if (checked) {
      const updatedOption = data;
      if (this.props.multiselect) {
        const isOptionAvailable = values.length ? values.every(option => this.matchtwoarray(option.path, data.path)) : false;
        if (isOptionAvailable) {
          const updatedOptionsData = values.filter(option => !this.matchtwoarray(option.path, data.path));
          ;
          return this.setState({ values: [updatedOptionsData] }, this.onOptionsChange);
        }
        ;
        return this.setState(
          { values: [...values, updatedOption] },
          this.onOptionsChange,
        );
      } else {
        ;
        return this.setState(
          { values: [updatedOption] },
          this.onOptionsChange,
        );
      }
    }
    ;
    ;
    const uncheckedOption = this.removeOption(values, data);
    return this.setState({ values: uncheckedOption }, this.onOptionsChange);
  }

  // remove options
  removeOption = (values, data) => values.filter(option => !this.matchtwoarray(option.path, data.path))

  isOneOptionChecked = (values, optionValue) => {
    if (values.length && values[0].path.length == optionValue.length) {
      return this.matchtwoarray(values[0].path, optionValue)
    }
    return false
  }

  isOptionChecked = (values, optionValue) => {
    console.error('multitude');
    if (values.length) {
      ;
      return values.every(item => this.matchtwoarray(item.path, optionValue))
    }
    return false
  }

  renderOptionsSelected = values => (
    values.map((item) => (
      <div
        key={item.path}
        className={`options-selected-container`}
      >
        {this.renderSubOptionsSelected(item)}
        <div
          onClick={() => this.removeSelectedGroup(item)}
          className={`remove-group`}
        >
          &#10005;
        </div>
      </div>
    ))
  )

  renderSubOptionsSelected = (data) => {
    const { options } = this.props;
    let parentindex = -1
    let parent = options
    return (
      <React.Fragment>
        <span className={`options-group`}>{` ${options[data.path[0]].label}`}</span>
        {data.path.length > 1 ? data.path.map((item, index) => {
          parentindex = item - parentindex - 1
          if (index === 0) {
            parent = parent[parentindex]
            return
          } else {
            if (parent.options) {
              parent = parent.options[parentindex]
            }
          }
          parentindex = item
          return <React.Fragment key={`${item.value}-${index}`}><span className={`options-group`}>{' ->'}</span><div className={`options-value`}>{`${parent.label}`}&nbsp;</div></React.Fragment>
        }) : null}
      </React.Fragment>
    )
  }

  renderCaretButton = () => {
    return (
      <div className="multi-selector-button" onClick={this.toggleMenu}>
        <div className={this.props.menuopen ? `arrow-up` : `arrow-down`} />
      </div>
    );
  }

  renderPlaceholder = () => {
    const { placeholder } = this.props;

    return (
      <div className={`multi-selector-placeholder`}>
        {placeholder || 'Select'}
      </div>
    );
  }

  renderOptionsMenu = (options) => (
    options.map((item, i) => {
      if (item.options) {
        if (this.props.samelevelselector) {
          const { values } = this.state;
          let checked
          if (this.props.multiselect) {
            checked = this.isOptionChecked(values, item.path);
            ;
          } else {
            checked = this.isOneOptionChecked(values, item.path);
            ;
          }
          return (
            <div key={`${item.value}-${i}`} className="options-container sls">
              <div className={`options-label`}>
                <label>
                  <div className={`options-sub-menu`}>
                    <input
                      type="checkbox"
                      value={item.value}
                      checked={checked}
                      name={item.label}
                      onChange={(event) => {
                        this.selectOption(item, event);
                      }}
                    />
                    <div className="checkbox"><span className="checkmark" /></div>
                    <div className={`options-label`}>{item.label}</div>
                  </div>
                </label>
              </div>{/*change Here FIXME*/}
              {this.renderSubMenu(item)}
            </div>
          );
        } else {
          return (
            <div key={`${item.value}-${i}`} className="options-container">
              <div className={`options-label`}>{item.label}</div>
              {this.renderSubMenu(item)}
            </div>
          );
        }
      }
      return (
        <React.Fragment key={`${item.value}-${i}`}>{this.renderSubMenu(item)}</React.Fragment>
      );
    })
  )
  renderSubMenu = (item) => {
    const { values } = this.state;
    if (item.options) {
      return (
        <>
          <div className={`arrow-right`} />
          <div className={`options-sub-menu-container`}>
            <div
              className={`options-sub-menu-header`}
            >
              {item.value}
            </div>
            {this.renderOptionsMenu(item.options, item)}
          </div>
        </>
      );
    }
    let checked
    if (this.props.multiselect) {
      checked = this.isOptionChecked(values, item.path);
    } else {
      checked = this.isOneOptionChecked(values, item.path);
    }
    return (
      <label>
        <div className={`options-sub-menu`}>
          <input
            type="checkbox"
            value={item.value}
            checked={checked}
            name={item.label}
            onChange={(event) => {
              this.selectOption(item, event);
            }}
          />
          <div className="checkbox"><span className="checkmark" /></div>
          <div className={`options-label`}>{item.label}</div>
        </div>
      </label>
    );
  }

  render() {
    const { values } = this.state;
    const { options } = this.props;
    return (
      <div className="multi-level-selector-container">
        <div className={`multi-selector-container ${this.props.menuopen ? `active` : 'inactive'}`}>
          <div className="multi-selector" onClick={this.toggleMenu}>
            {!values.length && this.renderPlaceholder()}
            {this.renderOptionsSelected(values)}
          </div>
          {this.renderCaretButton()}
        </div>
        <div className={`multi-level-options-container ${this.props.menuopen ? `menu-open` : `menu-close`}`}>
          <div className="options-main-menu">
            {this.renderOptionsMenu(options)}
          </div>
        </div>
      </div>
    );
  }
}

MultiLevelSelector.defaultProps = {
  placeholder: '',
  options: [],
  onChange: () => { },
  className: '',
  multiselect: false,
  samelevelselector: false,
  menuopen:undefined,//manage open state props your self due to outside clicks
  setmenuopen:undefined,//manage open state props your self  due to outside clicks
};

export default MultiLevelSelector;
