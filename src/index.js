import React, { Component } from 'react';
import styles from './MultiLevelSelector.module.css'
import {
  Menu,
  MenuButton,
  ControlledMenu,
  MenuItem,
  SubMenu,
  MenuHeader
} from '@szhsin/react-menu';
import '@szhsin/react-menu/dist/index.css';

class MultiLevelSelector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      values: [],
    };
  }
  a = true
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
    console.log('select entered');
    const { values } = this.state;
    const { value, checked } = event.target;
    if (checked) {
      const updatedOption = data;
      if (this.props.multiselect) {
        const isOptionAvailable = values.length ? values.every(option => this.matchtwoarray(option.path, data.path)) : false;
        if (isOptionAvailable) {
          const updatedOptionsData = values.filter(option => !this.matchtwoarray(option.path, data.path));
          console.log(updatedOptionsData);
          return this.setState({ values: [updatedOptionsData] }, this.onOptionsChange);
        }
        console.log('multi');
        return this.setState(
          { values: [...values, updatedOption] },
          this.onOptionsChange,
        );
      } else {
        console.log('not multi');
        return this.setState(
          { values: [updatedOption] },
          this.onOptionsChange,
        );
      }
    }
    console.log('left unchecked');
    console.log(values, value);
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
    // return values.some(e => e.value === optionValue);
  }

  isOptionChecked = (values, optionValue) => {
    console.error('multitude');
    if (values.length) {
      console.log(values, values[0].path, optionValue);
      return values.every(item => this.matchtwoarray(item.path, optionValue))
    }
    return false
    // if (parent) {
    //   return values.some((e) => {
    //     if (e.value === parent) {
    //       return e.options.some(item => item.value === optionValue);
    //     }
    //     if (e.options) {return this.isOptionChecked(e.options, optionValue, parent)};
    //     return false;
    //   });
    // }

    // return values.some(e => e.value === optionValue);
  }

  renderOptionsSelected = values => (
    values.map((item) => (
      <div
        key={item.path}
        className={`${styles.options_selected_container}`}
      >
        {this.renderSubOptionsSelected(item)}
        <div
          onClick={() => this.removeSelectedGroup(item)}
          className={`${styles.remove_group}`}
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
        <span className={`${styles.options_group}`}>{` ${options[data.path[0]].label}`}</span>
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
          return <React.Fragment key={`${item.value}-${index}`}><span className={`${styles.options_group}`}>{' ->'}</span><div className={`${styles.options_value}`}>{`${parent.label}`}&nbsp;</div></React.Fragment>
        }) : null}
      </React.Fragment>
    )
  }

  renderCaretButton = () => {

    return (
      <div className={`${styles.multi_selector_button}`} onClick={this.toggleMenu}>
        <div className={this.props.menuopen ? `styles.arrow_up` : `styles.arrow_down`} />
      </div>
    );
  }

  renderPlaceholder = () => {
    const { placeholder } = this.props;

    return (
      <div className={`${styles.multi_selector_placeholder}`}>
        {placeholder || 'Select'}
      </div>
    );
  }

  renderOptionsMenu = (options, parent = {}) => (
    options.map((item, i) => {
      if (item.options) {
        if (this.props.samelevelselector) {
          const { values } = this.state;
          let checked
          if (this.props.multiselect) {
            checked = this.isOptionChecked(values, item.path);
            console.log(checked);
          } else {
            checked = this.isOneOptionChecked(values, item.path);
            console.log(checked);
          }
          return (
            <div key={`${item.value}_${i}`} className={`${styles.options_container} ${styles.sls}`}>
              <div className={`${styles.options_label}`}>
                <label>
                  <div className={`${styles.options_sub_menu}`}>
                    <input
                      type="checkbox"
                      value={item.value}
                      checked={checked}
                      name={item.label}
                      onChange={(event) => {
                        this.selectOption(item, event);
                      }}
                    />
                    <div className={`${styles.checkbox}`}><span className={`${styles.checkmark}`} /></div>
                    <div className={`${styles.options_label}`}>{item.label}</div>
                  </div>
                </label>
              </div>{/*change Here FIXME*/}
              {this.renderSubMenu(item, parent)}
            </div>
          );
        } else {
          return (
            <div key={`${item.value}-${i}`} className={`${styles.options_container}`}>
              <div className={`${styles.options_label}`}>{item.label}</div>
              {this.renderSubMenu(item, parent)}
            </div>
          );
        }
      }
      return (
        <React.Fragment key={`${item.value}-${i}`}>{this.renderSubMenu(item, parent)}</React.Fragment>
      );
    })
  )
  renderOptionsMenues = (options, parent = {}) => (
    options.map((item, i) => {
      if (item.options) {
        if (this.props.samelevelselector) {
          const { values } = this.state;
          let checked
          if (this.props.multiselect) {
            checked = this.isOptionChecked(values, item.path);
            console.log(checked);
          } else {
            checked = this.isOneOptionChecked(values, item.path);
            console.log(checked);
          }
          return (
            // <SubMenu key={`${item.value}-${i}`} label={item.label} >
            <SubMenu offsetX={Object.keys(parent).length === 0 ? 0 : 25} position='anchor' key={`${item.value}-${i}`} label={item.label} >
              {/* <div className={`${styles.options_label}`}>
                <label>
                  <div className={`${styles.options_sub_menu}`}>
                    <input
                      type="checkbox"
                      value={item.value}
                      checked={checked}
                      name={item.label}
                      onChange={(event) => {
                        this.selectOption(item, event);
                      }}
                    />
                    <div className={`${styles.checkbox}`}><span className={`${styles.checkmark}`} /></div>
                    <div className={`${styles.options_label}`}>{item.label}</div>
                  </div>
                </label>
              </div>//change Here FIXME */}
              {this.renderSubMenuez(item, parent)}
            </SubMenu >
          );
        } else {
          return (
            // <SubMenu key={`${item.value}-${i}`} className={`${styles.options_container}`} label={item.label} >
            <SubMenu offsetX={Object.keys(parent).length === 0 ? 0 : 25} position='anchor' key={`${item.value}-${i}`} className={`${styles.options_container}`} label={item.label} >
              {/* <div className={`${styles.options_label}`}>{item.label}</div> */}
              {this.renderSubMenuez(item, parent)}
            </SubMenu >
          );
        }
      }
      return (
        <SubMenu key={`${item.value}-${i}`} label={item.label} >{this.renderSubMenuez(item, parent)}</SubMenu >);
      // <SubMenu position='anchor' key={`${item.value}-${i}`} label={item.label} >{this.renderSubMenuez(item, parent)}</SubMenu >);
    })
  )

  renderSubMenuez = (item, parent = {}) => {
    const { values } = this.state;
    if (item.options) {
      return (
        <MenuHeader >
          {item.value}
          {this.renderOptionsMenues(item.options, item)}
        </MenuHeader>
      );
    }
    // const checked = this.isOptionChecked(values, item.value, parent.value);
    let checked
    if (this.props.multiselect) {
      checked = this.isOptionChecked(values, item.path);
      // console.log(checked);
    } else {
      checked = this.isOneOptionChecked(values, item.path);
      // console.log(checked);
    }
    return (
      <MenuItem type='checkbox' checked={checked}>
        {/* <input
            type="checkbox"
            value={item.value}
            checked={checked}
            name={item.label}
            onChange={(event) => {
              this.selectOption(item, event);
            }}
          /> */}
        {item.label}
      </MenuItem>
    );
  }
  renderSubMenu = (item, parent = {}) => {
    const { values } = this.state;
    if (item.options) {
      return (
        <>
          <div className={`${styles.arrow_right}`} />
          <div className={styles.options_sub_menu_container_wrapper}>
            <div className={`${styles.options_sub_menu_container}`}>
              <div
                className={`${styles.options_sub_menu_header}`}
              >
                {item.value}
              </div>
              {this.renderOptionsMenu(item.options, item)}
            </div>
          </div>
        </>
      );
    }
    // const checked = this.isOptionChecked(values, item.value, parent.value);
    let checked
    if (this.props.multiselect) {
      checked = this.isOptionChecked(values, item.path);
      // console.log(checked);
    } else {
      checked = this.isOneOptionChecked(values, item.path);
      // console.log(checked);
    }
    return (
      <label>
        <div className={`${styles.options_sub_menu}`}>
          <input
            type="checkbox"
            value={item.value}
            checked={checked}
            name={item.label}
            onChange={(event) => {
              this.selectOption(item, event);
            }}
          />
          <div className={`${styles.checkbox}`}><span className={`${styles.checkmark}`} /></div>
          <div className={`${styles.options_label}`}>{item.label}</div>
        </div>
      </label>
    );
  }

  render() {
    const { values } = this.state;
    const { options } = this.props;
    const myref = React.createRef()
    return (
      <div className={`${styles.multi_level_selector_container}`}>
        <div ref={this.myref}
          className={`${styles.multi_selector_container} ${this.props.menuopen ? `active` : 'inactive'}`}
        >
          <div className={`${styles.multi_selector}`} onClick={this.toggleMenu}>
            {!values.length && this.renderPlaceholder()}
            {this.renderOptionsSelected(values)}
          </div>
          {this.renderCaretButton()}
        </div>
        {/* <ControlledMenu boundingBoxPadding={myref} isOpen={this.props.menuopen} onClose={() => this.props.setmenuopen(false)} direction="bottom" >
          {this.renderOptionsMenues(options)}
        </ControlledMenu> */}
        {/* <Menu menuButton={<MenuButton>Open menu</MenuButton>}>
          {this.renderOptionsMenues(options)}
        </Menu> */}
        <div className={`${styles.multi_level_options_container} ${this.props.menuopen ? `${styles.menu_open}` : `${styles.menu_close}`}`}>
          <div className={`${styles.options_main_menu}`}>
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
};

export default MultiLevelSelector;
