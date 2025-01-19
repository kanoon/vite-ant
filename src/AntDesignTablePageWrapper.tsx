/*
* Resources:
https://ant.design/components/table#table
https://dev.to/saisandeepvaddi/simple-extensions-to-make-your-ant-design-tables-better-3dg1
https://github.com/saisandeepvaddi/ant-table-extensions/blob/2.0/src/types.ts
*/

import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ColumnType, Table, TableProps } from 'ant-table-extensions'
import type {
  ColumnFilterItem,
  ColumnsType,
  FilterValue,
  SorterResult,
  FilterConfirmProps,
} from 'antd/es/table/interface'
// import { KTCard, KTCardBody, KTSVG } from '../../../_metronic/helpers'
import { Button, Input, InputRef, Space } from 'antd'
import Highlighter from 'react-highlight-words'

const pageTitle = 'Ant Design Table'

interface MenuGroupType {
  key: React.Key
  name: string
  customer: string
  section: string
  order: number
  menus?: MenuType[]
}

interface MenuType {
  key: React.Key
  name: string
  type: string
  order: number
  menus?: any
}

type DataIndex = keyof MenuGroupType

const menuColumns: ColumnsType<MenuType> = [
  { title: 'MENU', dataIndex: 'name', key: 'name' },
  { title: 'MENU TYPE', dataIndex: 'type', key: 'type' },
  { title: 'MENU ORDER', dataIndex: 'order', key: 'order' },
  {
    title: 'ACTIONS',
    dataIndex: '',
    key: 'x',
    render: () => <a>Delete</a>,
  },
]

const AntDesignTablePageWrapper: FC = () => {
  const [menuGroups, setMenuGroups] = useState<MenuGroupType[]>([])
  const [filteredInfo, setFilteredInfo] = useState<Record<string, FilterValue | null>>({})
  const [sortedInfo, setSortedInfo] = useState<SorterResult<MenuGroupType>>({})
  const [menuGroupColumns, setMenuGroupColumns] = useState<ColumnsType<MenuGroupType>>([])
  const [nameFilters, setNameFilters] = useState<ColumnFilterItem[]>()
  const [customerFilters, setCustomerFilters] = useState<ColumnFilterItem[]>()
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [currentDataSource, setCurrentDataSource] = useState([])

  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState('')
  const searchInput = useRef<InputRef>(null)

  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: string
  ) => {
    confirm()
    setSearchText(selectedKeys[0])
    setSearchedColumn(dataIndex)
  }

  const handleReset = (clearFilters: () => void) => {
    clearFilters()
    setSearchText('')
  }

  const handleChange: TableProps<MenuGroupType>['onChange'] = (
    pagination: any,
    filters: any,
    sorter: any,
    extra: any
  ) => {
    console.log('table pagination:', pagination)
    console.log('table filters:', filters)
    console.log('table sorter:', sorter)
    console.log('table current datasource:', extra.currentDataSource)
    setFilteredInfo(filters)
    setSortedInfo(sorter as SorterResult<MenuGroupType>)
    setCurrentDataSource(extra.currentDataSource)
  }

  const getColumnFilters = (values: string[]) => {
    return values.map((name) => ({ text: name, value: name }))
  }

  useEffect(() => {
    // TODO: fetch from API
    const mockMenuGroups = [
      {
        key: 1,
        name: 'Report',
        customer: 'CP',
        section: 'User',
        order: 1,
      },
      {
        key: 2,
        name: 'Configuration',
        customer: 'CP',
        section: 'Admin',
        order: 1,
        menus: [
          {
            key: 21,
            name: 'Device Configuration',
            type: 'Menu Link',
            order: 1,
            menus: [
              {
                key: 211,
                name: 'Device Configuration 1',
                type: 'Menu Link',
                order: 1,
              },
              {
                key: 212,
                name: 'Device Configuration 2',
                type: 'Menu Link',
                order: 2,
              },
            ],
          },
          {
            key: 22,
            name: 'Report Setting',
            type: 'Menu Link',
            order: 2,
          },
          {
            key: 23,
            name: 'Customer Management',
            type: 'Menu Link',
            order: 3,
          },
          {
            key: 24,
            name: 'Menu & Accessibility',
            type: 'Menu Link',
            order: 4,
          },
          {
            key: 25,
            name: 'Alarm Setting',
            type: 'Menu Link',
            order: 5,
          },
        ],
      },
      {
        key: 3,
        name: 'Preferences',
        customer: 'CP',
        section: 'Admin',
        order: 2,
        menus: [
          {
            key: 31,
            name: 'Device Configuration',
            type: 'Menu Link',
            order: 1,
          },
        ],
      },
      {
        key: 4,
        name: 'Platform Setting',
        customer: 'CP',
        section: 'Admin',
        order: 3,
      },
      {
        key: 5,
        name: 'Report',
        customer: 'PPT',
        section: 'User',
        order: 1,
      },
      {
        key: 6,
        name: 'Configuration',
        customer: 'PPT',
        section: 'Admin',
        order: 1,
      },
      {
        key: 7,
        name: 'Preferences',
        customer: 'PPT',
        section: 'Admin',
        order: 2,
      },
    ]

    setMenuGroups(mockMenuGroups)
  }, [])

  useEffect(() => {
    // TODO: fetch from API
    const availableNames = ['Configuration', 'Platform Setting', 'Preferences', 'Report']

    setNameFilters(getColumnFilters(availableNames))
  }, [])

  useEffect(() => {
    // TODO: fetch from API
    const availableCustomer = ['CP', 'PPT']

    setCustomerFilters(getColumnFilters(availableCustomer))
  }, [])

  const getColumnSearchProps = useCallback(
    (dataIndex: DataIndex): ColumnType<MenuGroupType> => ({
      filterDropdown: ({ setSelectedKeys , selectedKeys, confirm, clearFilters, close }) => (
        <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
          <Input
            ref={searchInput}
            placeholder={`Search ${dataIndex}`}
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
            style={{ marginBottom: 8, display: 'block' }}
          />
          <Space>
            <Button
              type='primary'
              onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
              // icon={
                // <KTSVG
                //   path='/media/icons/duotune/general/gen021.svg'
                //   className='svg-icon-2 svg-icon-primary'
                // />
              // }
              size='small'
              style={{ width: 90 }}
            >
              Search
            </Button>
            <Button
              onClick={() => clearFilters && handleReset(clearFilters)}
              size='small'
              style={{ width: 90 }}
            >
              Reset
            </Button>
            <Button
              type='link'
              size='small'
              onClick={() => {
                confirm({ closeDropdown: false })
                setSearchText((selectedKeys as string[])[0])
                setSearchedColumn(dataIndex)
              }}
            >
              Filter
            </Button>
            <Button
              type='link'
              size='small'
              onClick={() => {
                close()
              }}
            >
              close
            </Button>
          </Space>
        </div>
      ),
      filterIcon: () => (
        // <KTSVG
        //   path='/media/icons/duotune/general/gen021.svg'
        //   className='svg-icon-2 svg-icon-primary'
        // />
        <></>
      ),
      onFilter: (value: any, record: any) =>
        record[dataIndex]!.toString()
          .toLowerCase()
          .includes((value as string).toLowerCase()),
      onFilterDropdownOpenChange: (visible: any) => {
        if (visible) {
          setTimeout(() => searchInput.current?.select(), 100)
        }
      },
      render: (text: any) =>
        searchedColumn === dataIndex ? (
          <Highlighter
            highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ''}
          />
        ) : (
          text
        ),
    }),
    [searchText, searchedColumn]
  )

  useEffect(() => {
    const columns: ColumnsType<MenuGroupType> = [
      {
        title: 'MENU GROUP',
        dataIndex: 'name',
        key: 'name',
        filteredValue: filteredInfo.name || null,
        filters: nameFilters,
        filterSearch: true,
        sorter: (a, b) => a.name.localeCompare(b.name),
        sortOrder: sortedInfo.columnKey === 'name' ? sortedInfo.order : null,
        ...getColumnSearchProps('name'),
      },
      {
        title: 'CUSTOMER',
        dataIndex: 'customer',
        key: 'customer',
        filteredValue: filteredInfo.customer || null,
        filters: customerFilters,
        filterSearch: true,
        sorter: (a, b) => a.customer.localeCompare(b.customer),
        sortOrder: sortedInfo.columnKey === 'customer' ? sortedInfo.order : null,
        ...getColumnSearchProps('customer'),
      },
      { title: 'MENU SECTION', dataIndex: 'section', key: 'section' },
      { title: 'GROUP ORDER', dataIndex: 'order', key: 'order' },
      {
        title: 'ACTIONS',
        dataIndex: '',
        key: 'x',
        render: (row) => (
          <button
            name='del'
            type='button'
            className='btn btn-icon'
            title='Delete'
            onClick={() => console.log('action delete:', row)}
          >
            {/* <KTSVG
              path='/media/icons/duotune/general/gen027.svg'
              className='svg-icon-2 svg-icon-primary'
            /> */}
          </button>
        ),
      },
    ]

    setMenuGroupColumns(columns)
  }, [customerFilters, filteredInfo, getColumnSearchProps, nameFilters, sortedInfo])

  const renderSubMenuTable = useCallback((menus?: MenuType[]) => {
    return (
      (menus && (
        <>
          {/* <KTCard className='mt-8'>
            <KTCardBody className='py-4'> */}
              <Table
                columns={menuColumns}
                expandable={{
                  expandedRowRender: (record : any) => renderSubMenuTable(record.menus),
                  rowExpandable: (record : any) => !!record.menus?.length,
                }}
                dataSource={menus}
                pagination={false}
              />
            {/* </KTCardBody>
          </KTCard> */}
        </>
      )) ||
      null
    )
  }, [])

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys)
    setSelectedRowKeys(newSelectedRowKeys)
  }

  const renderMenuGroupTable = useMemo(() => {
    return (
      <>
        {/* <KTCard className='mt-8'>
          <KTCardBody className='py-4'> */}
            <Table
              columns={menuGroupColumns}
              expandable={{
                expandedRowRender: (record: any) => renderSubMenuTable(record.menus),
                rowExpandable: (record: any) => !!record.menus?.length,
              }}
              dataSource={menuGroups}
              onChange={handleChange}
              rowSelection={{
                type: 'checkbox',
                selectedRowKeys,
                onChange: onSelectChange,
              }}
              exportableProps={{ dataSource: currentDataSource }}
              searchable
            />
          {/* </KTCardBody>
        </KTCard> */}
      </>
    )
  }, [currentDataSource, menuGroupColumns, menuGroups, renderSubMenuTable, selectedRowKeys])

  return (
    <>
      <h1>{pageTitle}</h1>
      {renderMenuGroupTable}
    </>
  )
}

export default AntDesignTablePageWrapper
