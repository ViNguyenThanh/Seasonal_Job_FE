import React, { useEffect, useState } from 'react'
import './WorkerTransactions.css'
import avatar from '/assets/Work-On-Computer.png'
import { EyeOutlined, PhoneOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Empty, Form, Input, InputNumber, message, Modal, Pagination, Select } from 'antd';
import { paymentApi } from '../../../apis/payment.request';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { useFormik } from 'formik';

const WorkerTransactions = () => {
  const navigate = useNavigate();

  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await paymentApi.getTransactions();
        console.log(res.data);
        setTransactions(res.data.data);

      } catch (error) {
        // console.log(error);
        if (error.status === 404) {
          setTransactions([]);
        }
      }
    }
    fetchTransactions();
  }, []);

  const transactionData = [
    { id: 1, jobPostingName: 'Công việc thời vụ cho sự kiện tổ chức vào tháng 7, cần người hỗ trợ công việc chuẩn bị, trang trí và quản lý sự kiện', date: '25/07/2025', amount: 6300000, status: 'PENDING' },
    { id: 2, jobPostingName: 'Vị trí freelancer marketing cho chiến dịch quảng bá trong tháng 8, cần người có kinh nghiệm digital marketing', date: '20/07/2025', amount: 1200000, status: 'RELEASED' },
    { id: 3, jobPostingName: 'Trợ lý tạm thời cho các công việc văn phòng, giúp đỡ trong việc quản lý hồ sơ, sắp xếp tài liệu và các nhiệm vụ hành chính khác', date: '15/07/2025', amount: 3300000, status: 'CANCELLED' },
    { id: 4, jobPostingName: 'Công việc bán thời gian cho vị trí chăm sóc khách hàng trong tháng 9, yêu cầu kỹ năng giao tiếp và giải quyết khiếu nại', date: '10/07/2025', amount: 7000000, status: 'PENDING' },
    { id: 5, jobPostingName: 'Công việc nhập liệu tạm thời trong tháng 6, yêu cầu nhanh nhẹn, chính xác và có khả năng làm việc với dữ liệu lớn', date: '05/07/2025', amount: 400000, status: 'RELEASED' },
    { id: 6, jobPostingName: 'Vị trí hỗ trợ hành chính tạm thời cho dự án tháng 7, cần người có kỹ năng tổ chức công việc và hỗ trợ nhóm hiệu quả', date: '02/07/2025', amount: 2100000, status: 'RELEASED' },
    { id: 7, jobPostingName: 'Công việc freelancer nhiếp ảnh cho sự kiện đặc biệt, cần người có kinh nghiệm chụp hình sự kiện và khả năng sáng tạo', date: '28/06/2025', amount: 1800000, status: 'CANCELLED' },
    { id: 8, jobPostingName: 'Công việc bán thời gian viết nội dung mô tả sản phẩm cho các cửa hàng trực tuyến, yêu cầu khả năng viết sáng tạo và nhanh chóng', date: '22/06/2025', amount: 5500000, status: 'PENDING' },
    { id: 9, jobPostingName: 'Điều phối viên sự kiện cho một dự án tạm thời, yêu cầu kỹ năng tổ chức và làm việc dưới áp lực trong thời gian ngắn', date: '17/06/2025', amount: 690000, status: 'RELEASED' },
    { id: 10, jobPostingName: 'Công việc bán hàng tạm thời cho cuối tuần, cần người có kỹ năng giao tiếp và thuyết phục khách hàng', date: '12/06/2025', amount: 2600000, status: 'CANCELLED' },
    { id: 11, jobPostingName: 'Công việc kho tạm thời cho tháng 7, yêu cầu người có khả năng làm việc chăm chỉ và quản lý kho hiệu quả', date: '08/06/2025', amount: 4100000, status: 'RELEASED' },
    { id: 12, jobPostingName: 'Vị trí freelancer quản lý mạng xã hội cho chiến dịch ngắn hạn, yêu cầu kỹ năng truyền thông và sáng tạo nội dung', date: '03/06/2025', amount: 370000, status: 'PENDING' },
    { id: 13, jobPostingName: 'Công việc hành chính bán thời gian trong tháng 6, yêu cầu khả năng tổ chức và quản lý các công việc văn phòng', date: '29/05/2025', amount: 5000000, status: 'RELEASED' },
    { id: 14, jobPostingName: 'Vị trí thiết kế đồ họa tạm thời, yêu cầu người có kỹ năng sử dụng phần mềm thiết kế và sáng tạo', date: '25/05/2025', amount: 2800000, status: 'CANCELLED' },
    { id: 15, jobPostingName: 'Công việc viết nội dung freelancer cho chiến dịch tạo nội dung, yêu cầu khả năng viết sáng tạo và am hiểu về SEO', date: '20/05/2025', amount: 100000, status: 'PENDING' },
    { id: 16, jobPostingName: 'Nhân viên sự kiện tạm thời cho công việc tổ chức sự kiện, yêu cầu kỹ năng tổ chức và hỗ trợ đội ngũ trong công việc', date: '15/05/2025', amount: 3200000, status: 'RELEASED' },
  ];

  const getStatusClass = (status) => {
    if (status === 'PENDING') return 'pending';
    if (status === 'RELEASED') return 'released';
    if (status === 'CANCELLED') return 'cancelled';
    return '';
  };

  // Quản lý phân trang
  const [currentPage, setCurrentPage] = useState(1); // Trạng thái trang hiện tại
  const pageSize = 5; // Mỗi trang hiển thị 5 dòng

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // window.scrollTo(0, 0);
    const scrollPosition = window.innerWidth <= 850 ? 420 : 220;
    window.scroll({ top: scrollPosition, left: 0, behavior: 'smooth' });
  };

  const [amountValue, setAmountValue] = useState(null);
  const [statusValue, setStatusValue] = useState(null);

  const filteredTransactions = transactionData/*transactions.length > 0 ? transactions*/.filter(item => {
    return (
      (!statusValue || item.status === statusValue) &&
      (!amountValue || (item.amount >= amountValue[0] && item.amount <= amountValue[1]))
    );
  }) /*: []*/

  const [dateFilter, setDateFilter] = useState(null);
  const convertToDate = (dateString) => {
    const [day, month, year] = dateString.split('/');
    return new Date(`${year}-${month}-${day}`); // Chuyển thành định dạng YYYY-MM-DD
  };

  const sortedTransactions = filteredTransactions.sort((a, b) => {
    const dateA = convertToDate(a.date);
    const dateB = convertToDate(b.date);

    if (dateFilter === "newest") {
      return dateB - dateA; // Sắp xếp từ mới đến cũ
    } else if (dateFilter === "oldest") {
      return dateA - dateB; // Sắp xếp từ cũ đến mới
    }
    return 0;
  });

  const paginatedData = /*filteredTransactions.*/sortedTransactions.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // nếu không có avatar
  const [noAvatar, setNoAvatar] = useState(true);

  // Modal Withdraw 
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  // Mở modal
  const showConfirmModal = () => {
    setConfirmVisible(true);
  };

  // Đóng modal
  const closeConfirm = () => {
    setConfirmVisible(false);
    setPreviewImage('');
  };

  const formik = useFormik({
    initialValues: {
      accountNumber: "",
      accountName: "",
      amount: "",
      bankCode: "",
    },
    validationSchema: Yup.object({
      accountNumber: Yup.string()
        .test("no-leading-space", "* No spaces at the beginning", value => !/^\s/.test(value || ""))
        .matches(/^\d+$/, "* Account Number must contain digits only")
        .required("* Required"),
      accountName: Yup.string()
        .test("no-leading-space", "* No spaces at the beginning", value => !/^\s/.test(value || ""))
        // .matches(/^[A-Za-zÀ-ỹ\s]+$/, "* Only letters and spaces are allowed")
        .matches(/^(?!.*\s{2,})[A-ZÀ-Ỹ\s]+$/, "* Only uppercase letters are allowed") // Ko cho nhập dư 2 dấu cách
        .required("* Required"),
      amount: Yup.number().required("* Required"),
      bankCode: Yup.string()
        .notOneOf(["0"], "* Bank Code must be selected")
        .required("* Required"),
    }),
    onSubmit: (values) => {
      setConfirmLoading(true);
      setTimeout(() => {
        message.success('Withdrawal request submitted successfully!');
        // Xử lý khi bấm Submit
        setConfirmLoading(false);
        setConfirmVisible(false);
        formik.resetForm();
      }, 2000);
    },
  });

  // lấy API danh sách ngân hàng
  const [bankList, setBankList] = useState([]);
  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const res = await fetch('https://api.vietqr.io/v2/banks');
        const json = await res.json();
        setBankList(json.data);
      } catch (error) {
        console.error('Failed to fetch banks', error);
      }
    };
    fetchBanks();
  }, []);

  const [walletBalance, setWalletBalance] = useState(200000); // 200,000 VND mặc định

  return (
    <div className='worker-transactions-container'>
      <div className="worker-transactions-top">
        <div className="worker-identity-wallet">
          {noAvatar ? (
            <p className='no-avatar'><UserOutlined /></p>
          ) : (
            <img src={avatar} />
          )}
          <div className="worker-name-money">
            <p className='worker-name'>Trương Thị Quỳnh Giang</p>
            <p className='worker-money'>Wallet Balance: {walletBalance.toLocaleString('vi-VN')} VND</p>
          </div>
        </div>
        <div className="worker-withdraw">
          <button onClick={showConfirmModal}>
            <PhoneOutlined rotate={90} /> Withdraw
          </button>

          <Modal
            title="Withdrawal Request"
            open={confirmVisible}
            onCancel={closeConfirm}
            footer={null}
          >
            <form onSubmit={formik.handleSubmit} className="worker-withdraw-form">
              <div className="worker-withdraw-field">
                <p><span>*</span> Account Number: </p>
                <Form.Item
                  validateStatus={formik.errors.accountNumber && formik.touched.accountNumber ? "error" : ""}
                  help={formik.errors.accountNumber && formik.touched.accountNumber ? formik.errors.accountNumber : ""}
                >
                  <Input
                    className='input'
                    placeholder="Input your Account Number..."
                    name="accountNumber"
                    value={formik.values.accountNumber}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </Form.Item>
              </div>

              <div className="worker-withdraw-field">
                <p><span>*</span> Account Name: </p>
                <Form.Item
                  validateStatus={formik.errors.accountName && formik.touched.accountName ? "error" : ""}
                  help={formik.errors.accountName && formik.touched.accountName ? formik.errors.accountName : ""}
                >
                  <Input
                    className='input'
                    placeholder="Input your Account Name..."
                    name="accountName"
                    value={formik.values.accountName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </Form.Item>
              </div>
              <div className="worker-withdraw-field">
                <p><span>*</span> Bank: </p>
                <Form.Item
                  validateStatus={formik.errors.bankCode && formik.touched.bankCode ? "error" : ""}
                  help={formik.errors.bankCode && formik.touched.bankCode ? formik.errors.bankCode : ""}
                >
                  <Select
                  style={{
                    width: '100%',
                    margin: '0% 0 1%',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                    placeholder="Select a Bank"
                    options={bankList.map(bank => ({
                      value: bank.shortName,
                      label: bank.shortName + " - " + bank.name,
                    }))}
                    size="large"   
                    value={formik.values.bankCode || undefined}
                    onChange={(value) => formik.setFieldValue('bankCode', value || "")}
                    onBlur={() => formik.setTouched({ amount: true })}
                    allowClear
                    showSearch
                  >
                    <Select.Option value="0" disabled>
                      Select a Bank
                    </Select.Option>
                  </Select>
                </Form.Item>
              </div>

              <div className="worker-withdraw-field">
                <p><span>*</span> Amount: </p>
                <Form.Item
                  validateStatus={formik.errors.amount && formik.touched.amount ? "error" : ""}
                  help={formik.errors.amount && formik.touched.amount ? formik.errors.amount : ""}
                >
                  <InputNumber
                    className='input-number'
                    size="large"
                    placeholder="Input the amount you want to withdraw..."
                    name="amount"
                    addonAfter="VND"
                    formatter={(value) => value?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                    parser={(value) => value?.replace(/\./g, "")}
                    // defaultValue={1}
                    min={2000} // Không cho nhập số âm hoặc 0
                    max={walletBalance}
                    // InputNumber nhận giá trị kiểu number, trong khi formik.handleChange mặc định xử lý event.target.value. 
                    // //Vì vậy, cần dùng formik.setFieldValue thay vì formik.handleChange.
                    onChange={(value) => formik.setFieldValue("amount", value)}
                    onBlur={() => formik.setTouched({ amount: true })}
                    value={formik.values.amount}
                  />
                </Form.Item>
              </div>
              <div className="send-request-btn">
                <Button
                  type="primary"
                  onClick={formik.handleSubmit}
                  // htmlType="submit"
                  loading={confirmLoading}
                  size='large'
                >
                  Send request
                </Button>
              </div>
            </form>
          </Modal>
        </div>
      </div>

      <div className="worker-transactions-bottom">
        <h1>My transaction history</h1>

        {transactionData/*transactions*/.length === 0 ? (
          <div className="no-transactions">
            <Empty description="You do not have a transaction yet!" />
          </div>
        ) : (
          <>
            <div className="worker-transactions-select">
              <Select
                placeholder="Filter by Date"
                value={dateFilter || 'newest'}
                onChange={(value) => {
                  setDateFilter(value);
                  setCurrentPage(1); // Reset to the first page when date filter changes
                }}
                size="large"
                // allowClear
                options={[
                  { value: 'newest', label: 'Newest' },
                  { value: 'oldest', label: 'Oldest' }
                ]}
              />
              <Select
                placeholder="Amount"
                value={amountValue ? JSON.stringify(amountValue) : null}
                onChange={(value) => {
                  if (value == null) {
                    // Nếu người dùng nhấn "clear", đặt giá trị về null
                    setAmountValue(null);
                  } else {
                    // Chuyển chuỗi JSON thành mảng
                    setAmountValue(JSON.parse(value));
                  }
                  setCurrentPage(1);
                }}
                filterOption={(input, option) =>
                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
                size="large"
                allowClear
                options={[
                  { value: JSON.stringify([0, 1999999]), label: 'Under 2 million VND' },
                  { value: JSON.stringify([2000000, 5000000]), label: 'From 2 to 5 million VND' },
                  { value: JSON.stringify([5000001, 10000000]), label: 'Over 5 to 10 million VND' },
                  { value: JSON.stringify([10000001, Number.MAX_SAFE_INTEGER]), label: 'Over 10 million VND' }
                ]}
              >
                <Select.Option value="sample">Sample</Select.Option>
              </Select>
              <Select
                placeholder="Status"
                value={statusValue}
                onChange={(value) => {
                  setStatusValue(value);
                  setCurrentPage(1);
                }}
                filterOption={(input, option) =>
                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
                size="large"
                allowClear
                options={[
                  { value: 'PENDING', label: 'PENDING' },
                  { value: 'RELEASED', label: 'RELEASED' },
                  { value: 'CANCELLED', label: 'CANCELLED' },
                ]}
              />
            </div>

            {filteredTransactions.length === 0 ? (
              <div className="no-transactions">
                <Empty description="No transactions found!" />
              </div>
            ) : (
              <>
                <div className="worker-transactions-whole-table">
                  <table className='worker-transactions-table'>
                    <thead>
                      <tr>
                        <th className='job-posting-name'>Job Posting Name</th>
                        <th className='date'>Date</th>
                        <th className='amount'>Amount (VND)</th>
                        <th className='status'>Status</th>
                        <th className='detail'>Detail</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/*transactionData*/paginatedData.map(item => (
                        <tr key={item.id}>
                          <td className='job-posting-name'>{item.jobPostingName}</td>
                          <td className='date'>{item.date}</td>
                          <td className='amount'>{item.amount.toLocaleString('vi-VN')}</td>
                          <td className='status'>
                            <span className={getStatusClass(item.status)}>{item.status}</span>
                          </td>
                          <td className='detail'>
                            <Button onClick={() => navigate(`/worker/worker-transactions/worker-transaction-detail/${item.id}`, { state: item }, window.scrollTo(0, 0))}>
                              <EyeOutlined />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <Pagination
                  current={currentPage}
                  pageSize={pageSize}
                  total={filteredTransactions.length}
                  onChange={handlePageChange}
                  showSizeChanger={false}
                  align="center"
                  showLessItems
                  showQuickJumper
                />
              </>
            )}
          </>
        )}

      </div>
    </div>
  )
}

export default WorkerTransactions